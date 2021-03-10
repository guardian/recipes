/** @jsx jsx */
import { jsx } from "@emotion/core";
import {actions} from "~actions/recipeActions";
import { Dispatch } from "@reduxjs/toolkit";
import { ActionType } from "~components/interfaces";
import React = require("react");

function handleChange(event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, dispatcher: Dispatch<ActionType>): void{
  const objId = event.target.id;
  const objVal = event.target.value;
  dispatcher({"type": actions.change,
              "payload": {[objId]: objVal}});
}

function handleRemoveField(id:string, dispatcher: Dispatch<ActionType>): void {
  dispatcher({"type": actions.delete,
              "payload": {"objId": id} });
}

function renderInput(text: string, key: string, choices: Array<string>|null, dispatcher?: Dispatch<ActionType>|null, removable?: boolean){
  const removeId = `${key}`;
  const rmAllowed = removable ? removable : true;
  if (choices === null || choices === undefined){
    console.log(`${text} ${key}`);
    return ( 
      <><input css={{ minWidth: "500px" }} type="text" value={text} key={key} id={key} onChange={(event) => handleChange(event, dispatcher)}></input>
        { rmAllowed && 
        <button type="button" id={removeId} onClick={() => handleRemoveField(removeId, dispatcher)}>-</button>
        }</>
    )
  } else {
    const choices_ = choices.slice();
    choices_.unshift('None');
    return (
    <><select css={{ minWidth: "500px" }} value={text} key={key} id={key} onChange={(event) => handleChange(event, dispatcher)}>
      {choices_.map( (item) => {return <option key={`${key}.${String(item)}`} value={item}>{item}</option>} )}
      </select>
      { rmAllowed &&
        <button type="button" id={removeId} onClick={() => handleRemoveField(removeId, dispatcher)}>-</button>
      }</>
    )
  }
}

interface FormItemProps {
    label: string,
    text: string,
    type: string|null,
    choices: Array<string>|null
    dispatcher?: Dispatch<ActionType>|null
  }
  
function FormItem(prop: FormItemProps): JSX.Element{
  const label = prop.label;
  const text = prop.text;
  const choices = prop.choices || null;
  const dispatch = prop.dispatcher || null;

  return renderInput(text, label, choices, dispatch)

}
export default FormItem;