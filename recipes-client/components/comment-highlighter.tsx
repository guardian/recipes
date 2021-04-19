/** @jsx jsx */
import { jsx } from "@emotion/core";

/* Original component from Giant, see here:
https://github.com/guardian/pfi/blob/bfbb074e362e832944f4c708693698f9b5e7e9e2/frontend/giant-ui/src/js/components/viewer/CommentHighlighter.tsx
*/
import React, { ReactElement, useState, createElement } from 'react';
import sortBy from 'lodash-es/sortBy';
import filter from "lodash-es/filter";
import { Highlight, ResourceRange } from '~interfaces/main';
import { HTMLElement  } from 'node-html-parser';
import { createHighlightTextFractions, markHTML, mergeHighlights, createHighlightHTML } from "~utils/highlighting";

type FlattenAction =
    { type: 'delete' } |
    { type: 'truncate', range: ResourceRange };

function getFlattenAction(target: Highlight, highlights: Highlight[]): FlattenAction {
    let startCharacter = target.range.startCharacter;
    let endCharacter = target.range.endCharacter;

    for(const highlight of highlights) {
        if(highlight !== target && highlight.type === 'comment') {
            const startsInside = target.range.startCharacter >= highlight.range.startCharacter
                && target.range.startCharacter <= highlight.range.endCharacter;

            const endsInside = target.range.endCharacter >= highlight.range.startCharacter
                && target.range.endCharacter <= highlight.range.endCharacter;

            if(startsInside && endsInside) {
                return { type: 'delete' };
            } else if(startsInside) {
                startCharacter = highlight.range.endCharacter;
            } else if(endsInside) {
                endCharacter = highlight.range.startCharacter;
            }
        }
    }

    return { type: 'truncate', range: {...target.range, startCharacter, endCharacter } };
}

// Highlights that overlap each other need special treatment because
// of the hierarchical nature of the DOM.
function separateOverlappingHighlights(highlights: Highlight[]): Highlight[] {
    let ret = [...highlights];

    for(const highlight of highlights) {
        if(highlight.type === 'comment' && highlight.id === 'new-comment') {
            // Ensure the highlighting for text we have just selected is not truncated
            continue;
        }

        // We need to pass the modified array
        const action = getFlattenAction(highlight, ret);

        switch(action.type) {
            case 'delete':
                ret = ret.filter(({ id }) => id !== highlight.id);
                break;

            case 'truncate':
                ret = ret.map(h => h.id === highlight.id ? {...h, range: action.range } : h);
                break;
        }
    }

    return ret;
}

type HighlightWrapperProps = {
    highlight: Highlight,
    text: string,
    focused: boolean,
    onHighlightMount: (id: string, top: number, elem: HTMLElement) => void,
    focusComment: (id: string) => void
}

function HighlightWrapper({ highlight, text, focused, onHighlightMount, focusComment }: HighlightWrapperProps): JSX.Element {
    const [top, setTop] = useState<number | undefined>();

    function onMountOrUnmount(elem: HTMLElement | null) {
        if(elem) {
            // IMPORTANT: this guard avoids infinite loops
            // The ref is mounted, we then setHighlightRenderedPosition which causes another render
            // and another call infinitely, unless we check that the position has not changed.
            // if(elem.offsetTop !== top) {
            //     onHighlightMount(highlight.id, elem.offsetTop, elem);
            // }

            // setTop(elem.offsetTop);
        }
    }

    const elementType = String(highlight.type); // === 'comment' ? 'comment-highlight' : 'result-highlight';

    return createElement(
        'span',
        {
            'class': focused ? `${elementType}--focused` : `${elementType}`,
            'data-highlight-offset': highlight.range.startCharacter,
            'ref': onMountOrUnmount
            // 'onClick': (e: React.MouseEvent) => {
            //     if(highlight.type === 'comment') {
            //         e.stopPropagation();
            //         focusComment(highlight.id);
            //     }
            // }
        },
        text.slice(highlight.range.startCharacter, highlight.range.endCharacter)
    );
}

type Props = {
    text: string,
    highlights: Highlight[],
    focusedId?: string,
    onHighlightMount: (id: string, top: number, elem: HTMLElement) => void,
    focusComment: (id: string) => void
}

export function CommentHighlighter({ text, highlights, focusedId, onHighlightMount, focusComment }: Props): JSX.Element[] {
    const sorted: Highlight[] = sortBy(highlights, ({ range: { startCharacter } }: Highlight) => startCharacter);
    const flattened = separateOverlappingHighlights(sorted);
    const [end, children] = flattened.reduce(([ptr, acc], highlight) => {
        const before = (<span key={`pre-${highlight.id}`} data-highlight-offset={ptr}>
            {text.slice(ptr, highlight.range.startCharacter)}
        </span>);

        const inside = <HighlightWrapper
            key={highlight.id}
            highlight={highlight}
            text={text}
            focused={highlight.id === focusedId}
            onHighlightMount={onHighlightMount}
            focusComment={focusComment}
        />;

        return [highlight.range.endCharacter, [...acc, before, inside]]
    }, [0, [] as ReactElement[]]);

    if(end < text.length) {
        children.push(<span key='catch-all' data-highlight-offset={end}>{text.slice(end, text.length)}</span>)
    }
    return <span className='comment__text'>
        {children}
    </span>
}


export function highlightText(text: string | any[], highlights: Highlight[], focusedId: string, onHighlightMount: (id: string, top: number, elem: HTMLElement) => void, focusComment: (id: string) => void){
    const sorted: Highlight[] = sortBy(highlights, ({ range: { startCharacter } }: Highlight) => startCharacter);
    const flattened = separateOverlappingHighlights(sorted);

    const [end, children] = flattened.reduce(([ptr, acc], highlight) => {
        const before = <span key={`pre-${highlight.id}`} data-highlight-offset={ptr}>
            {text.slice(ptr, highlight.range.startCharacter)}
        </span>;

        const inside = <HighlightWrapper
            key={highlight.id}
            highlight={highlight}
            text={text}
            focused={highlight.id === focusedId}
            onHighlightMount={onHighlightMount}
            focusComment={focusComment}
        />;

        return [highlight.range.endCharacter, [...acc, before, inside]]
    }, [0, [] as ReactElement[]]);

    return children;
}

function flatten(array: Highlight[][]): Highlight[] {
    return array.reduce(function(memo, el) {
        const items = Array.isArray(el) ? flatten(el) : [el];
        return memo.concat(items);
    }, []);
}

type TextProps = {
    text: HTMLElement,
    highlights: Highlight[][],
    label: string,
    colours?: Record<string,string> | null
}

export function HighlightByLine(props: TextProps){
    const { text, highlights, colours } = props;
    const flat_highlights = flatten(highlights) //Extra flattening step
    const sorted: Highlight[] = sortBy(flat_highlights, ['range.elementNumber', 'range.startCharacter']);
    const [before, inside, after] = createHighlightTextFractions(sorted, text.innerHTML);

    const altered = inside.map((insideText, i) => {
        const highlightType = sorted[i].type;
        const lastInSpan = (highlights[Math.min(highlights.length-1, i+1)].id !== highlights[i].id) || (i === highlights.length-1);
        return markHTML(insideText.trim(), highlightType, colours[highlightType], lastInSpan)
    });

    return <div className={"byline"} dangerouslySetInnerHTML={{__html: mergeHighlights(before, altered, after)}} />
}

type HTMLProps = {
        html: HTMLElement,
        highlights: Highlight[][],
        focusedId?: string,
        onHighlightMount: (id: string, top: number, elem: HTMLElement) => void,
        focusComment: (id: string) => void,
        colours?: Record<string,string> | null
    }

// export function HighlightHTML({ html, highlights, focusedId, onHighlightMount, focusComment }) {
export function HighlightHTML(props: HTMLProps) {
    const { html, highlights, focusedId, onHighlightMount, focusComment, colours } = props;
    const flat_highlights = flatten(highlights) //Extra flattening step
    const sorted: Highlight[] = sortBy(flat_highlights, ['range.elementNumber', 'range.startCharacter']);
    
    // const flattened = separateOverlappingHighlights(sorted);
    const htmlNodes = (Array.from(html.childNodes) as HTMLElement[]);

    const children = htmlNodes.map((node, inode) => {
        const relevantHighlights: Highlight[] = filter(sorted, ({ range: range }: Highlight ) => range.elementNumber === inode )
        const CustomTag = node.rawTagName ? `${node.rawTagName.toLowerCase()}`: 'div';
        if (relevantHighlights.length === 0) { 
            // nothing to change return original
            return <CustomTag key={inode} dangerouslySetInnerHTML={{__html: node.outerHTML}} />
        } else {
            return <CustomTag key={inode} dangerouslySetInnerHTML={{__html: createHighlightHTML(relevantHighlights, node, colours) }} />
        }
    })

    return <span className='article_body'>
        {children}
    </span>

};