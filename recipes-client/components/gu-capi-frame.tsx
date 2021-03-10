/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import React from 'react';
import { HighlightHTML, HighlightPlainText} from "~components/comment-highlighter";
import { GuCAPIProps, recipeFields} from '~components/interfaces'
import { getHighlights, DOMParse } from "~utils/html-parsing";
import {defaultHighlightColours} from "~consts/index";


function onHighlightMount(id: string, top: number, elem: HTMLElement): void {
  console.debug(`${id} highlight mount.`)
  console.debug(`${elem.innerHTML} ${top}`)
};

function focusComment(id: string): void {
  console.log(`${id} focussed.`)
};

function filterKey(dict: Record<string, unknown>, key: string): Record<string, unknown> { 
  return Object.keys(dict
    ).filter(key_ => (key_ === key)
    ).reduce((obj, key_) => {
        obj[key_] = dict[key_];
        return obj;
      }, {});
}

function filterOutKey(dict: Record<string, unknown>, key: string): Record<string, unknown> { 
  return Object.keys(dict
    ).filter(key_ => (key_ !== key)
    ).reduce((obj, key_) => {
        obj[key_] = dict[key_];
        return obj;
      }, {});
}

function filterOutKeys(dict: Record<string, unknown>, keys: string[]): Record<string, unknown> { 
  return Object.keys(dict
    ).filter(key_ => (!keys.includes(key_))
    ).reduce((obj, key_) => {
        obj[key_] = dict[key_];
        return obj;
      }, {});
}

function GuCAPIFrame(props: GuCAPIProps): JSX.Element {
  const {isLoading, recipeItems, html, colours} = props;
  if (isLoading || recipeItems === null){
    return <h3> LOADING... </h3>
  } else {
    const cols = (colours === null || colours === undefined) ? defaultHighlightColours : colours;
    const colourMap = Object.keys(recipeItems).reduce((acc, key, i) => {
      acc[key] = cols[i % cols.length];
      return acc
    }, {} as typeof recipeItems)

    const doc = DOMParse(html['fields']['body'])
    const byline = DOMParse(html['fields']['byline'])
    const recipeItemsByline = filterKey((recipeItems as Record<string, unknown>), 'credit') as recipeFields;
    const bylineHighlights = getHighlights(byline, recipeItemsByline);
    const recipeItemsBody = filterOutKeys((recipeItems as Record<string, unknown>), ['credit', 'recipeId']) as recipeFields;
    const highlights = getHighlights(doc, recipeItemsBody);

    return (
    <>
    <h1> {html.webTitle} </h1> 
    <h3>Byline:
      <HighlightPlainText text={byline} highlights={bylineHighlights} focusedId="" onHighlightMount={onHighlightMount} focusComment={focusComment} colours={colourMap}/>
    </h3>
      <Global styles={{
        '.gu-image': { 
          maxWidth: '100%',
          height: 'auto',
        }
      }} />
        <HighlightHTML  html={doc} highlights={highlights} focusedId="" onHighlightMount={onHighlightMount} focusComment={focusComment} colours={colourMap} />
    </>
    )
  }
}

export default GuCAPIFrame;
