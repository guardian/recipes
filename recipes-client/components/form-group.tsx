/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";
import FormItem from "./form-item";

import recipeSchema from "~/data/recipe-schema"


function formatTitle(text: string|null){
    // Reformat title with first letter uppercase
    if (text === null){
        return null;
    } else {
        const title = text.replace('_', ' ');
        return <legend> {title[0].toUpperCase() + title.slice(1)} </legend>
    }
  }


  function renderFormGroup(fI: Array<string|Record<string, unknown>> | Record<string, unknown>, title?: string, schema: schemaItem, key?: string){
    // Return FormGroup JSX, this is mainly because TS has an issue with an inline component that can multiple types as input  ¯\_(ツ)_/¯
    return <FormGroup formItems={fI}  title={title} schema={schema} key={key}></FormGroup>
  }


  function getSchemaType(typ: string|Array<string>): Array<string>{
    if (Array.isArray(typ)){
      return typ;
    } else {
      return new Array(typ)
    }
  }

// function parseItem(label:string, data: string|Array<Record<string, unknown>>|Record<string, unknown>, parentLabel: int|string|null): Array<Record<string, unknown>> {
//     // Goes through the tree and parses elements
//     if (typeof(data)==='string'){
//       // String means the end of the line, return input field
//       return makeInputField(label, data, parentLabel); //<input type="text" value={data} readOnly></input>
//     } else if (data instanceof Array) {
//       // Array, loop through and create flat array of DOM elements
//       const itemList: Record<string, unknown> = data.map((item, i) => {return parseItem(label, item, i);})
//       return Array(itemList.flat()) as Array<Record<string, unknown>>;
//     } else if (data instanceof Object){
//       // HashMap, loop through and add keys as name of input field
//       const keys = Object.keys(data);
//       return keys.map(k => {
//         return [formatLabel(k), parseItem(k, data[k], label)]
//       })
  
//     } else {
//       // No idea what data's type is, print out
//       console.warn(data)
//       return null;
//     }
//   }

// function createItemsFromObject(obj: Record<string, unknown>){
//     return (
//     <p>
//         <FormItem text={formItems[index]} label={key} key={index}> </FormItem>
//     </p>
//     )
// }

interface schemaItem {
    type: string;
    items?: Array<Record<string, unknown>>;
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

interface FormGroupProps {
    formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown>
    schema: schemaItem
    title: string|null
  }
  
  class FormGroup extends Component<FormGroupProps> {
    constructor(props: FormGroupProps) {
      super(props);
    }

    render() {
        // TODO: Replace JSX return with functions above
        const formItems = this.props.formItems;
        const schema = this.props.schema;
        const title = this.props.title || null;
        const label = null;
        if (getSchemaType(schema.type).includes("string") && typeof formItems === "string"){
          return (
              <fieldset>
              <legend>{formatTitle(title)}</legend>
                      <FormItem text={formItems} label={title} key={formItems}> </FormItem>
              </fieldset>
          )
        } else if (schema.type === "array" && Array.isArray(formItems)) {
          const formItemArray = formItems.map( (item:schemaItem) => {
            return renderFormGroup(item,  null, schema.items, item)
          })

          return (
                  <fieldset>
                  <legend>{formatTitle(title)}</legend>
                      {formItemArray}
                  </fieldset>
                  ) 
        } else if (schema.type === "object" && typeof formItems === 'object'){
          // HashMap, loop through and add keys as name of input field
          const keys = Object.keys(formItems);
          return ( <fieldset>
                    <legend>{formatTitle(title)}</legend>
                  {keys.map(k => {
                          return renderFormGroup(formItems[k],  k, schema.properties[k])
                      // }
                  })}
                  </fieldset>
          )
        }
    }
  }
export default FormGroup;