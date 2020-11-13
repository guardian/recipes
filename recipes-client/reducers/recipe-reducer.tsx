/** @jsx jsx */
import {actions} from "~/actions/recipeActions";
import produce from "immer";
import { ActionType, CurationState } from "~components/interfaces";

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

function initStateItem(draft: Record<string, unknown>, k: string, value: string|number): void{
  draft[k] = value;
}

export const recipeReducer = produce((draft: CurationState, action: ActionType) => {
    switch (action.type) {
      case actions.change: {
        const key = Object.keys(action.payload)[0]
        const keyPathArr = key.split('.')
        updateBodyItem(draft.body, keyPathArr, action.payload[key])
        break;
      }
      case actions.init: {
        Object.keys(action.payload).forEach((k) => { 
          initStateItem(draft, k, action.payload[k])
        })
        break;
      }
      default: {
        throw new Error();
      }
    }
}, {})