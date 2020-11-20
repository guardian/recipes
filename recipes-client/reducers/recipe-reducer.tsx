/** @jsx jsx */
import {actions} from "~/actions/recipeActions";
import produce from "immer";
import { ActionType, CurationState, schemaItem, isCurationState } from "~components/interfaces";

export const defaultState: CurationState = {
    isLoading: true, 
    body: null, 
    schema: null 
};
  
function updateBodyItem(obj: Record<string, unknown>, keyPath: Array<string>, value: string|number): void {
  const lastKeyIndex = keyPath.length-1;
  for (let i = 0; i < lastKeyIndex; ++ i) {
    const key = keyPath[i];
    const nextKey = i < lastKeyIndex ? keyPath[i+1] : NaN
    if (!(key in obj)){
      // Check whether array is needed rather than dict
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

function deleteBodyItem(obj: Record<string, unknown>, keyPath: Array<string>): void {
  const lastKeyIndex = keyPath.length-1;
  for (let i = 0; i < lastKeyIndex; ++ i) {
    const key = keyPath[i];
    const nextKey = i < lastKeyIndex ? keyPath[i+1] : NaN
    if (!(key in obj)){
      // Check whether array is needed rather than dict
      if (isFinite(nextKey)) {
        obj[key] = []
      }
      else {
        obj[key] = {}
      }
    }
    obj = obj[key];
  }
  delete obj[keyPath[lastKeyIndex]];
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
      // const outputArray = schemaPropKeys.map<Array<string|Record<string, unknown>>>(key => {keyof typeof plotOptions;
      const outputArray = schemaPropKeys.map<Array<string|Record<string, unknown>>>(key => {
          return [key, getSchemaItem(item[key])];
      }, [])
      const oo = Object.fromEntries(outputArray);
      return oo
  } else {
    new ErrorEvent("Invalid schemaItem provided.");
  }
}

// function mapArray(input: schemaItem){
//   const schemaPropKeys = Object.keys(input);
//   return schemaPropKeys.map(key => {
//     return [key, getSchemaItem(input[key])];
//   }, [])
// }

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
          deleteBodyItem(draft.body, keyPathArr)          
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
      case actions.error: {
        alert(action.payload);
        break
      }
      default: {
        throw new Error();
      }
    }
}, {})