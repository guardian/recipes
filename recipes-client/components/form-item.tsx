/** @jsx jsx */
// import { Component, useReducer } from "react";
import { jsx } from "@emotion/core";
// import { defaultState, recipeReducer, initConfig } from "~/reducers/recipeReducer"; // This needs to stay in so that 'defaultState' is available.
import {actions} from "~actions/recipeActions";
// import useRecipe from "~components/recipe-component"
import { Dispatch } from "@reduxjs/toolkit";
import { ActionType } from "~components/interfaces";

function formatTitle(text: string){
    // Reformat title with first letter Uppercase
    const title = text.replace('_', ' ');
    return title[0].toUpperCase() + title.slice(1);
  }

function handleChange(event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, dispatcher: Dispatch<ActionType>): void{
  console.log(event.target);
  const objId = event.target.id;
  const objVal = event.target.value;
  dispatcher({"type": actions.change,
              "payload": {[objId]: objVal}});
}

function renderInput(text: string, key: string, choices: Array<string>|null, dispatcher?: Dispatch<ActionType>|null){
  if (choices === null || choices === undefined){
    return <input css={{ minWidth: "500px" }} type="text" value={text} key={key} id={key} onChange={(event) => handleChange(event, dispatcher)}></input>
  } else {
    const choices_ = choices.slice();
    choices_.unshift('None');
    return (
    <select css={{ minWidth: "500px" }} value={text} key={key} id={key} onChange={(event) => handleChange(event, dispatcher)}>
      {choices_.map( (item) => {return <option key={`${key}.${String(item)}`} value={item}>{item}</option>} )}
    </select>
    )
  }
}

interface FormItemProps {
    label: string|null,
    text: string,
    type: string|null,
    choices: Array<string>|null
    dispatcher?: Dispatch<ActionType>|null
  }
  
function FormItem(prop: FormItemProps): JSX.Element{
  // const [state, dispatch] = useReducer(recipeReducer, defaultState);
  // const [state, dispatch] = useRecipe();
  const label = prop.label;
  const text = prop.text;
  const choices = prop.choices || null;
  const dispatch = prop.dispatcher || null;

  if (label) {
    return (
      <p>
          <label css={{ marginRight: "10px"}} key={label+'.label'}>{formatTitle(label)}</label>
          {renderInput(text, label, choices, dispatch)}
      </p>
    )
  } else {
    return renderInput(text, null, choices, dispatch)
  }
}
export default FormItem;