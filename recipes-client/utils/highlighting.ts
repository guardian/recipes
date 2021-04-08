import { Highlight } from '~interfaces/main';
import { HTMLElement } from 'node-html-parser';
import { extractCommonText } from  '~utils/html-parsing';

export function createHighlightTextFractions(highlights: Highlight[], text: string): string[][] {
    // Create before, after and inside slices of text to allow applying markup at later stage 
    return highlights.reduce<Array<string[]>>(([b, i, a], highlight) => {
        const before = text.slice(0, Math.max(0, highlight.range.startCharacter));
        const after = text.slice(highlight.range.endCharacter);
        const inside = text.slice(highlight.range.startCharacter, highlight.range.endCharacter);
        return [[...b, before], [...i, inside], [...a, after]];
    }, [[], [], []]);
}

export function createHighlightHTML(highlights: Highlight[], node: HTMLElement,
    // onHighlightMount: (id: string, top: number, elem: HTMLElement) => void,
    // focusComment: (id: string) => void,
    colours: Record<string, string>): string {

    const [before, inside, after] = createHighlightTextFractions(highlights, node.innerHTML);
    const altered = inside.map((insideText, i) => {
        const highlightType = (highlights[i].type as string);
        const lastInSpan = (highlights[Math.min(highlights.length - 1, i + 1)].id !== highlights[i].id) || (i === highlights.length - 1);
        return markHTML(insideText.trim(), highlightType, colours[highlightType], lastInSpan); //onHighlightMount, focusComment, lastInSpan);
    });
    return mergeHighlights(before, altered, after);
}

export function markHTML(text: string, type: string, colour: string, applyLabel?: boolean): string {
    return `<mark class="${type}" style="background: ${colour}; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">${text}
    ${applyLabel ? renderLabel(type) : ""}
    </mark>`
}

export function mergeHighlights(before_: string[], inside_: string[], after_: string[]): string {
    // Given array of altered texts, merge them to avoid duplication.
    let result = ""
    inside_.forEach((a, i) => {
        if (i === 0 ){
            result = result.concat(`${before_[i]} ${inside_[i]}`.trim())
        } else {
            // work out common text
            const newBefore = extractCommonText(before_[i], after_[i-1])
            // stripCommonText(after[i-1], before[i])
            result = result.concat(` ${newBefore} ${inside_[i]}`)
        }
    // Add remaining string
    result = result.concat(after_[inside_.length-1])
    
    });
    return result;
}

function renderLabel(label: string): string {
    return `<span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">${label}</span>`
}