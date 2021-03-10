/** @jsx jsx */
import {actions} from "~/actions/recipeActions";
import produce from "immer";
import { ActionType, CurationState, schemaItem, isCurationState } from "~components/interfaces";
import { defaultHighlightColours } from "~consts";

export const defaultState: CurationState = {
    isLoading: true, 
    body: null, 
    schema: null,
    colours: null
};
  
function updateBodyItem(obj: Record<string, unknown>, keyPath: Array<string>, value: string|number): void {
  const lastKeyIndex = keyPath.length-1;
  for (let i = 0; i < lastKeyIndex; ++ i) {
    const key = keyPath[i];
    const nextKey = i < lastKeyIndex ? keyPath[i+1] : NaN
    if (!(key in obj)){
      // Check whether array is needed (key is number) rather than dict
      if (isFinite(nextKey)) {
        obj[key] = []
      }
      else {
        obj[key] = {}
      }
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

function deleteBodyItem(keyPath: Array<string|number>, obj: Record<string, unknown>): void {
  const lastKeyIndex = keyPath.length-1;
  for (let i = 0; i < lastKeyIndex; ++ i) {
    const key = keyPath[i];
    const nextKey = i < lastKeyIndex ? keyPath[i+1] : NaN
    if (!(key in obj)){
      // Check whether array is needed (key is number) rather than dict
      if (isFinite(nextKey)) {
        obj[parseInt(key)] = []
      }
      else {
        obj[key] = {}
      }
    }
    obj = obj[key];
  }
  keyPath = keyPath.map(item => {const s = isFinite(item) ? parseInt(item): item; return s;})
  // if (isFinite(keyPath[lastKeyIndex])){
  //   const lastKeyNum = parseInt(keyPath.slice(lastKeyIndex, lastKeyIndex+1).slice(-1));
  //   keyPath = keyPath.slice(0, lastKeyIndex);
  //   keyPath.push(lastKeyNum);
  // }
  if (Array.isArray(obj)){
    obj.splice(keyPath[lastKeyIndex], 1)
  } else {
    delete obj[keyPath[lastKeyIndex]]
  }
}

function initStateItem(draft: Record<string, unknown>, k: string, value: string|number): void{
  draft[k] = value;
}

function getSchemaItem(schemaI: schemaItem): string|Record<string, unknown>|Array<Record<string,unknown>> {
  // Function returning "default" values for new item of type schemaItem.
  if (schemaI.type === "string") {
    return "" ;
  } else if (schemaI.type === "array") {
      if (schemaI.items.type === "string"){
      // Simple list like steps
      return schemaI.items.map( (item:schemaItem) => {
        return getSchemaItem(item);
      })
    } else {
      // More complex object like ingredient lists
          const items = schemaI.items;
          return [getSchemaItem(items)];
      // })
    }
  } else if (schemaI.type === "object" || typeof schemaI === "object"){
      const schemaPropKeys = Object.keys(schemaI.properties);
      const item = schemaI.properties;
      const outputArray = schemaPropKeys.map<Array<string|Record<string, unknown>>>(key => {
          return [key, getSchemaItem(item[key])];
      }, [])
      return Entries2Object(outputArray);
  } else {
    new ErrorEvent("Invalid schemaItem provided.");
  }
}

function Entries2Object(arr: (string | Record<string, unknown>)[][]): Record<string, unknown>{
  // Helper function to replace `Object.fromEntries(arr)`
  return [...arr].reduce((obj: Record<string, unknown>, [key, val]) => {
    if (typeof(key) === "string") {
      obj[key] = val
      return obj
    }
  }, {})
}

export const recipeReducer = produce((draft: CurationState, action: ActionType) => {
    switch (action.type) {
      case actions.change: {
        const key = Object.keys(action.payload)[0]
        const keyPathArr = key.split(".")
        updateBodyItem(draft.body, keyPathArr, action.payload[key])
        break;
      }
      case actions.init: {
        Object.keys(action.payload).forEach((k) => { 
          initStateItem(draft, k, action.payload[k])
        })
        break;
      }
      case actions.reset: {
        initStateItem(draft, "body", action.payload.body)
        break;
      }
      case actions.delete: {
        if (!isCurationState(action.payload)){
          const keyPathArr = action.payload["objId"].split(".")
          deleteBodyItem(keyPathArr, draft.body);        
        }
        break;
      }
      case actions.add: {
        if (!isCurationState(action.payload)){
            const keyPathArr = action.payload["objId"].split(".")
            const value = getSchemaItem(action.schemaItem)
            updateBodyItem(draft.body, keyPathArr, value)
          }
        break;
      }
      case actions.changeColours: {
        if (isCurationState(action.payload)){
          const colours = (action.payload.colours !== null) ? action.payload.colours : defaultHighlightColours;
          // let colourMap = null;
          // if (colours === null) {
          //   colourMap = Object.keys(recipeItems).reduce((acc, key, i) => {
          //     acc[key] = cols[i % cols.length];
          //     return acc
          //   }, {})
          // } else {
            
          // }
          initStateItem(draft, "colours", colours);
        }
        break;
      }
      case actions.error: {
        alert(action.payload);
        break
      }
      default: {
        throw new Error();
      }
    }
}, {})