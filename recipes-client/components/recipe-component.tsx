/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";

function formatTitle(text: string){
  // Reformat title with first letter uppercase
  const title = text.replace('_', ' ');
  return title[0].toUpperCase() + title.slice(1);
}

function formatLabel(text: string){
  // Create label node for input field
  return (<label key={text}>{formatTitle(text)}</label>)
}

function makeInputField(key: string, text: string, parentKey:string|null){
  const newKey = (parentKey ? parentKey+'_'+key : key);  
  return <input css={{ minWidth: "300" }} type="text" key={newKey} name={newKey} value={text} readOnly></input>
}


function parseItem(label:string, data: string|Array<Record<string, unknown>>|Record<string, unknown>, parentLabel: int|string|null): Array<Record<string, unknown>> {
  // Goes through the tree and parses elements
  if (typeof(data)==='string'){
    // String means the end of the line, return input field
    return makeInputField(label, data, parentLabel); //<input type="text" value={data} readOnly></input>
  } else if (data instanceof Array) {
    // Array, loop through and create flat array of DOM elements
    const itemList: Record<string, unknown> = data.map((item, i) => {return parseItem(label, item, i);})
    return Array(itemList.flat()) as Array<Record<string, unknown>>;
  } else if (data instanceof Object){
    // HashMap, loop through and add keys as name of input field
    const keys = Object.keys(data);
    return keys.map(k => {
      return [formatLabel(k), parseItem(k, data[k], label)]
    })

  } else {
    // No idea what data's type is, print out
    console.warn(data)
    return null;
  }
}

interface RecipeComponentProps {
  title: string,
  body: Record<string, unknown>|null,
  schema: Record<string, unknown>
}

class RecipeComponent extends Component<RecipeComponentProps> {
  constructor(props: RecipeComponentProps) {
    super(props);
  }
  render() {
    const body = this.props.body;
    if (body != null){
      const items: Record<string, unknown> = Object.entries(body).map( (k: Record<string, unknown>) => {
        return [formatTitle(k[0]), parseItem(k[0], k[1])];
      })
      return (
        <span>
        {items.map((i: Record<string, unknown>) => <li key={i[0]}>{i}</li>)};
        </span>
      )
    } else{
      return <h3> LOADING... </h3>
    }
  }
}
export default RecipeComponent;
