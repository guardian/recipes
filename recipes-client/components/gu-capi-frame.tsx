/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import React from 'react';
import { HighlightHTML, HighlightByLine} from "~components/comment-highlighter";
import { allRecipeFields, GuCAPIProps, recipeFields, recipeItem, schemaArrayItem, schemaItem, schemaType} from '~interfaces/main'
import { getHighlights, DOMParse, getUniqueHighlightTypes } from "~utils/html-parsing";
import { defaultHighlightColours, excludeInHighlights, bylineFields } from "~consts/index";
import { filterKeys, filterOutKeys } from "~utils/filter";
import { getSchemaType } from "~utils/schema";
import { createColourMap } from "~utils/colours";

function onHighlightMount(id: string, top: number, elem: HTMLElement): void {
  console.debug(`${id} highlight mount.`)
  console.debug(`${elem.innerHTML} ${top}`)
};

function focusComment(id: string): void {
  console.log(`${id} focussed.`)
};

function isSchemaArray(obj: number|string|string[]|recipeItem|schemaItem|schemaType): obj is schemaArrayItem {
  if (obj === null | typeof obj === 'string') { return false };
  return "items" in Object.keys(obj);
} 

// function isSchemaArray<T extends {item?: any}>(obj: T): obj is schemaArrayItem {
//   return typeof obj.item === "object";
// } 


// Todo: Move to better place
function flattenSchema(schema: schemaType): string[]{
  // Get all keys from `schema` and output list of them
  // For nested keys, create a composite key (level1.level1)
  const schemaProp = schema.properties;
  return (Object.keys(schemaProp) as Array<keyof allRecipeFields>).reduce((acc, key) => {
    const schemaEl = schemaProp[key];
    if (isSchemaArray(schemaEl)){
      if (Object.keys(schemaEl.items).includes("type") && 
          getSchemaType(schemaEl.items.type).includes('object')) {
        const compositeKeys = Object.keys(
          schemaEl.items.properties
          ).map(i => `${key}.${i}`);
        return [...acc, ...compositeKeys]
      }
    }
    return [...acc, key];
  }, [] as string[])
}
function GuCAPIFrame(props: GuCAPIProps): JSX.Element {
  const {isLoading, recipeItems, html, schema, colours} = props;
  if (isLoading || recipeItems === null || schema === null){
    return <h3> LOADING... </h3>
  } else {
    const doc = DOMParse(html['fields']['body'])
    const byline = DOMParse(html['fields']['byline'])
    const recipeItemsByline = filterKeys((recipeItems as Record<string, unknown>), bylineFields) as recipeFields;
    const bylineHighlights = getHighlights(byline, recipeItemsByline);
    const recipeItemsBody = filterOutKeys((recipeItems as Record<string, unknown>), excludeInHighlights) as recipeFields;
    const highlights = getHighlights(doc, recipeItemsBody);

    const cols = (colours === null || colours === undefined) ? defaultHighlightColours : colours;
    const keyList = getUniqueHighlightTypes(bylineHighlights.concat(highlights)); //flattenSchema(schema);
    const colourMap = createColourMap(keyList, cols);

    return (
    <>
    <h1> {html.webTitle} </h1> 
    <h3>Byline:
      <HighlightByLine text={byline} highlights={bylineHighlights} focusedId="" onHighlightMount={onHighlightMount} focusComment={focusComment} colours={colourMap}/>
    </h3>
      <Global styles={{
        '.gu-image': { 
          maxWidth: '100%',
          height: 'auto',
        }
      }} />
        <p dangerouslySetInnerHTML={{__html: html.fields.main}} />
        <HighlightHTML  html={doc} highlights={highlights} focusedId="" onHighlightMount={onHighlightMount} focusComment={focusComment} colours={colourMap} />
    </>
    )
  }
}

export default GuCAPIFrame;
