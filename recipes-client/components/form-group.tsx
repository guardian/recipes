/** @jsx jsx */
import { Component, Dispatch } from "react";
import { jsx } from "@emotion/core";
import FormItem from "./form-item";
import { ActionType } from "~components/interfaces";
import {actions} from "~actions/recipeActions";


function formatTitle(text: string|null){
    // Reformat title with first letter uppercase
    if (text === null){
        return null;
    } else {
        const title = text.replace('_', ' ');
        return <legend> {title[0].toUpperCase() + title.slice(1)} </legend>
    }
  }


export function renderFormGroup(fI: Array<string|Record<string, unknown>> | Record<string, unknown>, title: string|null, schema: schemaItem, key?: string, dispatcher?:Dispatch<ActionType>): React.Component|JSX.Element{
  // Return FormGroup JSX, this is mainly because TS has an issue with an inline component that can have multiple types as input  ¯\_(ツ)_/¯
  return <FormGroup formItems={fI}  title={title} schema={schema} key_={key} key={key} dispatcher={dispatcher}></FormGroup>
}


function getSchemaType(typ: string|Array<string>): Array<string>{
  if (Array.isArray(typ)){
    return typ;
  } else {
    return new Array(typ)
  }
}

function handleAddField(objId: string, schemaItem: schemaItem, dispatcher: Dispatch<ActionType>): void {
  dispatcher({"type": actions.add,
              "payload": {"objId": objId},
              "schemaItem": schemaItem
            });
}

function handleRemoveField(objId: string, dispatcher: Dispatch<ActionType>): void {
  dispatcher({"type": actions.delete,
              "payload": {"objId": objId},
            });
}

interface schemaItem {
    type: string;
    items?: Array<Record<string, unknown>>;
    properties?: Record<string, unknown>;
    enum?: Array<string>;
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
    title: string
    key_?: string|null
    dispatcher?: Dispatch<ActionType>|null
  }
  
class FormGroup extends Component<FormGroupProps> {
  constructor(props: FormGroupProps) {
    super(props);
  }

  render(): React.Component|JSX.Element {
      const { formItems, schema, title } = this.props;
      const  choices = schema.enum || null;
      const key = this.props.key_ || title;
      const dispatcher = this.props.dispatcher || null;
      if (getSchemaType(schema.type).includes("string") && typeof formItems === "string"){
        return (
            <fieldset key={`${key}.fieldset`}>
            <legend key={`${key}.legend`}>{formatTitle(title)}</legend>
              <FormItem text={formItems} choices={choices} label={key} key={`${key}.formItem`} dispatcher={dispatcher}> </FormItem>
            </fieldset>
        )
      } else if (schema.type === "array" && Array.isArray(formItems)) {
        const formItemArrayRender = formItems.map( (item:schemaItem, i:int) => {
          return (
            renderFormGroup(item,  null, schema.items, key+'.'+String(i), dispatcher)
          )
        });

        const formItemAddId = `${key}.${formItemArrayRender.length}`;
        const formItemRemoveLastId = `${key}.${formItemArrayRender.length-1}`; 
        return (
                <fieldset key={`${key}.fieldset`}>
                <legend key={`${key}.legend`}>{formatTitle(title)}</legend>
                    {formItemArrayRender}
                <button type="button" id={`${key}.add`} onClick={() => handleAddField(formItemAddId, schema.items, dispatcher)}>+  {key.split('.').slice(-1)[0]}</button>
                <button type="button" id={`${key}.remove`} onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}>-  {key.split('.').slice(-1)[0]}</button>
                </fieldset>
                ) 
      } else if (schema.type === "object" && typeof formItems === 'object'){
        // HashMap, loop through and add keys as name of input field
        const keys = Object.keys(formItems);
        return ( <fieldset key={`${key}.fieldset`}>
                  <legend key={`${key}.legend`}>{formatTitle(title)}</legend>
                {keys.map(k => {
                        return renderFormGroup(formItems[k],  k, schema.properties[k], `${key}.${k}`, dispatcher)
                })}
                </fieldset>
        )
      }
  }
}
export default FormGroup;