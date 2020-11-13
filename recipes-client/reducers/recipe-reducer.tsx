/** @jsx jsx */
// import { Action, createNextState, State } from "@reduxjs/toolkit";
import {actions} from "~/actions/recipeActions";
import produce from "immer";
import { ActionType, CurationState } from "~components/interfaces";

export const defaultState: CurationState = {
    isLoading: true, 
    body: null, 
    schema: null 
};
  

// export const initConfig = (state) => ({
// ...defaultState,
// ...state,
// });

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

// function updateBodyItem(id: Array<string|number>, body: Record<string, unknown>, val:string|number|null) {
//   if (findOriginalBodyItem(id, body) === null){
//     return null;
//   } else {
//     //loop through id and create nested object for each entry in array
//     let object = {};
//     let updatedItem = id.reduce(function(o, s) { return o[s] = {}; }, object);
//     // If single value for that key, replace value

//     // Otherwise, copy tree part and update value
//   }
// }

// import produce from "immer"

// const byId = produce((draft, action) => {
//     switch (action.type) {
//         case RECEIVE_PRODUCTS:
//             action.products.forEach(product => {
//                 draft[product.id] = product
//             })
//     }
// }, {})

// const getNum = (arr: Array<string>) => {
//   // Convert all strings in array that are numbers to actual numbers
//   return arr.map(x => isNaN(parseInt(x)) ? x : parseInt(x));
// }

// export const recipeReducer = (state: State, action: ActionType): State => {
export const recipeReducer = produce((draft: CurationState, action: ActionType) => {
    switch (action.type) {
      case actions.change: {
        const key = Object.keys(action.payload)[0]
        // const keyPathArr = getNum(key.split('.'))
        const keyPathArr = key.split('.')
        // function updateBodyItem(obj, keyPath, value) {
        updateBodyItem(draft.body, keyPathArr, action.payload[key])
        // s.split('.').map(x => isNaN(parseInt(x)) ? x : parseInt(x))
        // return {
        //     ...state,
        //     body: {state.newBody, ...newBody}
        // }
        break;
      }
      case actions.init: {
        // draft.schema = action.payload.schema;
        Object.keys(action.payload).forEach((k) => { 
          // if (k in Object.keys(CurationState){
          //   draft[k] = action.payload[k];
          // }
          initStateItem(draft, k, action.payload[k])
        })
        // return {
        //   ...draft,
        //   ...action.payload
        // }
        break;
      }
      default: {
        throw new Error();
      }
    }
}, {})


// export const recipeReducer = (state: State, action: Action): State => {
//     // if (state.isLoading) {return state;}
//     switch (action.type) {
//       case actions.change:
//         console.warn(state);
//         console.warn(action);
//         const key = Object.keys(action.payload)[0]
//         const keyPathArr = getNum(key.split('.'))
//         // function updateBodyItem(obj, keyPath, value) {
//         const newBody = updateBodyItem(state.body, keyPathArr, action.payload[key])
//         // s.split('.').map(x => isNaN(parseInt(x)) ? x : parseInt(x))
//         return {
//             ...state,
//             body: {state.newBody, ...newBody}
//         }
//       case actions.init:
//         console.log(action);
//         return {
//           ...state,
//           ...action.payload
//         }
//       default:
//         throw new Error();
//     }
//   }