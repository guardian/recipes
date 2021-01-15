import { Highlight, ingredientField, recipeFields, recipeItem, ResourceRange, schemaItem, timeField, ingredientListFields } from "~components/interfaces";
// const htmlparser2 = require("htmlparser2");
import { HTMLElement, parse } from 'node-html-parser';
import flatten from "lodash-es/flatten";


// export function DOMParse(html: string): HTMLElement {
//     const parser = new DOMParser();
//     const doc: HTMLDocument = parser.parseFromString(html, 'text/html');
//     return doc.body;
//   }

export function DOMParse(html: string) {
    // const dom = htmlparser2.parseDocument(html);
    const dom = parse(html);
    return dom;
  }

function flattenChildNodes(node: HTMLElement): string {
  return node.childNodes.reduce((prev, n) => {
    const n_ =  (n as HTMLElement);
    return n_.innerHTML ? prev = prev.concat(n_.innerHTML): prev;
  }, '')
}

interface matchOffests {
  start: number;
  end: number;
}

function getMatchWithoutAttributes(match: RegExpExecArray, node: HTMLElement): matchOffests[] {
  // Flatten child nodes
  const innerHTML = flattenChildNodes(node);
  // get text match from flattened
  const newRegex = new RegExp(`(${match[0]})`);
  const newMatch = newRegex.exec(innerHTML);
  if (newMatch === null) {
    return []
  } else {
    // // work out where the real match is in complete expression
    const [start, ] = node.innerHTML.split(innerHTML).map((i) => {return i.length})
    return [{
      'start': start + newMatch.index, 
      'end': start + newMatch.index + newMatch[0].length
    }]
  }
}

export function getHighlights(doc: HTMLElement, recipeItems: recipeFields): Highlight[]{
  // Create array of Highlight objects from 'doc' given 'recipeItems'
  const allHighlights = Object.entries(recipeItems).map( (k: [string, recipeItem]) => {
    const textItems: string[] = flatten(getTextfromRecipeItem(k[1])) // bit of a hack, better approach?
    const highlights = textItems.map( text => {
      const offsets = findTextinHTML(text, doc)
      const ttt = offsets.map( offset => {
        const {startCharacter, endCharacter, elementNumber} = offset;
        const highlightType = k[0]
        const id = `${highlightType}_${elementNumber}_${startCharacter}_${endCharacter}`
        return {
          'id': id,
          'type': highlightType,
          'range': {...offset}
        }
      })
      return ttt;
    })
    return flatten(flatten(highlights));
  });
  return flatten(allHighlights);
}

function isIngredientListField(arg: any): arg is ingredientField {
  if (typeof arg === "string"){ return false; }
  return 'item' in arg;
}

function isIngredientFieldsArray(arg: Array<string|ingredientListFields|ingredientField|timeField>): arg is ingredientListFields[] {
  if (typeof arg[0] === "string"){ return false; }
  return 'ingredients' in arg[0];
}

function isIngredientField(arg: any): arg is ingredientField {
  if (typeof arg === "string"){ return false; }
  return 'item' in arg;
}

function isTimeField(arg: any): arg is timeField[] {
  if (typeof arg === "string"){ return false; }
  return 'instruction' in arg;
}

function isStringArray(arg: Array<unknown>): arg is string[] {
  return typeof arg[0] === "string";
}

export function isArrayOf<T>(array: any[], func: new ()=>T): array is T[] {
  if (array.length === 0 || array[0] instanceof func) {
    return true;
  }

  return false;
}

export function getTextfromRecipeItem(item: recipeItem): string[] {
  /* Extract text from recipe item
     Select relevant field (item if array of strings, 'text' if object)
  */
  const isString = (curVal: number|string|Array<unknown> | Record<string,unknown>) => typeof(curVal) === "string"
  if (typeof(item) === 'string'){
    // Plain string, wrap up as array
    return [item];
  } else if (item instanceof Array) {
    if (isStringArray(item)) {
      return item;
    } else if (isIngredientFieldsArray(item)) {
      return flatten(item.map(i => {
        return getTextfromRecipeItem(i['ingredients']);
      }));
    } else {
      return flatten((item as Array<timeField|ingredientField>).map(i => {
        return getTextfromRecipeItem(i);
      }));
    }
  } else {
    // Object: timeField|ingredientField
      return [item['text']]
  }
}

export function findTextinHTML(text: string, html: HTMLElement): ResourceRange[] {
    // Escape special characters helper
    function escapeRegExp(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    const words: string[] = escapeRegExp(text.trim()).split(/\s/).map(w => {
      // Remove trailing punctuation attached to word
      return w.replace(/[,.\\]+$/, "");
    }); //(?<=[\s.*?>])/); //(' ')
    // const regex = new RegExp(`(${words.join(").*?(")})`, 'gm') //= /word1.*?word2/gm
    const regex = new RegExp(`(${words.join(").{0,30}?(")})`, 'gm') // Limit search space to up to 30 characters
    const results: ResourceRange[] = [];

    
    Array.from(html.childNodes).forEach((el, indx) => {
      const match = regex.exec((el as HTMLElement).innerHTML);
      // while (match !== undefined && match !== null) {
      if (match !== undefined && match !== null) {
        // Avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        } else {
          if ((el as HTMLElement).innerHTML === (el as HTMLElement).innerText) {
            // No additional markup inside, return match as is WITH outer tag
            // const [start, _] = el.toString().split((el as HTMLElement).innerHTML ).map((i) => {return i.length});
            results.push({
              "elementNumber": indx,
              "startCharacter" : match.index,
              "endCharacter": match.index + match[0].length
            })
          } else {
            // Additional markup inside, avoid getting attibutes
            const matchClean = getMatchWithoutAttributes(match, (el as HTMLElement))
            if (matchClean.length !== 0) {
              matchClean.forEach((m) => {
                results.push({
                  "elementNumber": indx,
                  "startCharacter" : m.start,
                  "endCharacter": m.end
                })
              });              
            } else {
              match.slice(1).forEach((m) => {
                results.push({
                  "elementNumber": indx,
                  "startCharacter" : match.index + match[0].indexOf(m),
                  "endCharacter": match.index + match[0].indexOf(m) + m.length
                })
              })
            }
            // Additional markup inside, need to work out where match is in the HTML
            // const submatches = getOffsetsInMarkup(words, match, el)
            // results = [...results, [subMatches];
  
          
          }
        }
      }
    });
    return results;
  }
  

export function extractCommonText(str1: string, str2: string): string {
    // Get overlapping text between end of str1 and beginning of str2
    const separator = "@@@@@@"
    const pattern = new RegExp(`(.*)${separator}\\1`);
    const match = pattern.exec(str1 + separator + str2);
    if (match !== null){
      return match[1];
    } else {
      return '';
    }
}