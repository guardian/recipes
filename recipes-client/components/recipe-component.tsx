/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";

function formatTitle(text: string){
  // Reformat title with first letter uppercase
  let title = text.replace('_', ' ');
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


function parseItem(label:string, data: string|Array<Object>|Object, parentLabel: string|null){
  // Goes through the tree and parses elements
  if (typeof(data)==='string'){
    // String means the end of the line, return input field
    return makeInputField(label, data, parentLabel); //<input type="text" value={data} readOnly></input>
  } else if (data instanceof Array) {
    // Array, loop through and create flat array of DOM elements
    let itemList: Array<Array<Object>> = data.map((item, i) => {return parseItem(label, item, i);})
    return itemList.flat();
  } else if (data instanceof Object){
    // HashMap, loop through and add keys as name of input field
    let keys = Object.keys(data);
    let output = new Array();
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
  body: object
}

class RecipeComponent extends Component<RecipeComponentProps> {
  constructor(props: RecipeComponentProps) {
    super(props);
  }
  render() {
    const body = this.props.body;
    const items = Object.entries(body).map( (k: any) => {
      return [formatTitle(k[0]), parseItem(k[0], k[1])];
    })
    return (
      <span>
      {items.map((i: any) => <li key={i[0]}>{i}</li>)};
      </span>
    )
  }
}
export default RecipeComponent;
