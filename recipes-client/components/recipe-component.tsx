/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";
import FormGroup from "~components/form-group";
import renderFormGroup from "~components/form-group";

// function formatTitle(text: string){
//   // Reformat title with first letter uppercase
//   const title = text.replace('_', ' ');
//   return title[0].toUpperCase() + title.slice(1);
// }

// function formatLabel(text: string){
//   // Create label node for input field
//   return (<label key={text}>{formatTitle(text)}</label>)
// }

// function makeInputField(key: string, text: string, parentKey:string|null){
//   const newKey = (parentKey ? parentKey+'_'+key : key);  
//   return <input css={{ minWidth: "300" }} type="text" key={newKey} name={newKey} value={text} readOnly></input>
// }


// function parseItem(label:string, data: string|Array<Record<string, unknown>>|Record<string, unknown>, parentLabel: int|string|null): Array<Record<string, unknown>> {
//   // Goes through the tree and parses elements
//   if (typeof(data)==='string'){
//     // String means the end of the line, return input field
//     return makeInputField(label, data, parentLabel); //<input type="text" value={data} readOnly></input>
//   } else if (data instanceof Array) {
//     // Array, loop through and create flat array of DOM elements
//     const itemList: Record<string, unknown> = data.map((item, i) => {return parseItem(label, item, i);})
//     return Array(itemList.flat()) as Array<Record<string, unknown>>;
//   } else if (data instanceof Object){
//     // HashMap, loop through and add keys as name of input field
//     const keys = Object.keys(data);
//     return keys.map(k => {
//       return [formatLabel(k), parseItem(k, data[k], label)]
//     })

//   } else {
//     // No idea what data's type is, print out
//     console.warn(data)
//     return null;
//   }
// }

// function returnFGO(fI: Array<string|Record<string, unknown>> | Record<string, unknown>, title?: string, schema: schemaItem){
//   return <FormGroup formItems={fI} title={title} schema={schema}></FormGroup>
// }

interface RecipeComponentProps {
  title: string
  body: Record<string, unknown>|null
  schema: schemaType
  isLoading: boolean
}

interface schemaItem {
  type: string;
  items?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

// What's the point of having a fetch-ed schema then?
interface schemaType {
  'properties': {
  "path": schemaItem;
  "recipes_title": schemaItem;
  "serves": schemaItem;
  "time": schemaItem;
  "steps": schemaItem;
  "credit": schemaItem;
  "ingredients_lists": schemaItem;
  "occasion": schemaItem;
  "cuisines": schemaItem;
  }
}

class RecipeComponent extends Component<RecipeComponentProps> {
  constructor(props: RecipeComponentProps) {
    super(props);
  }
  render(): React.Component|JSX.Element {
    if (this.props.schema === null){
      return <h3> No schema loaded... </h3>
    } else if (this.props.isLoading){
      return <h3> LOADING... </h3>
    } else {
      const body = this.props.body;
      const schema: schemaType = this.props.schema;
      console.log(Object.entries(body));
      return Object.entries(body).map( (k: ArrayLike<Record<string, unknown>>) => {
        return renderFormGroup(k[1], k[0], schema.properties[k[0]])
      })
    }
  }
}
export default RecipeComponent;
