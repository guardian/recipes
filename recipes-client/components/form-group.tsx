/** @jsx jsx */
import { Component, Dispatch } from "react";
import { jsx } from "@emotion/core";
import FormItem from "./form-item";
import { ActionType, schemaItem } from "~interfaces/main";
import {actions} from "~actions/recipeActions";
import { getSchemaType } from "~utils/schema";

function isStringOrNumber(item: string | Array<string|Record<string, unknown>> | Record<string, unknown>){
  return (typeof item === "string" || typeof item === "number")
}

function formatTitle(text: string|null){
    // Reformat title with first letter uppercase
    if (text === null){
        return null;
    } else {
        const title = text.replace('_', ' ');
        return <legend> {title[0].toUpperCase() + title.slice(1)} </legend>
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

interface FormGroupProps {
    formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown>
    schema: schemaItem
    title: string
    key_?: string|null
    dispatcher?: Dispatch<ActionType>|null
}

export function renderFormGroup(fI: Record<string, string>, schema: schemaItem, key: string, dispatcher?:Dispatch<ActionType>): JSX.Element[]{
  // Return FormGroup JSX, this is mainly because TS has an issue with an inline component that can have multiple types as input  ¯\_(ツ)_/¯
  const formFields = Object.entries(fI).reduce((acc, [k, val]) => {
      const tmp = getFormFields(val, schema[k], k, dispatcher)
      const arr = Array.isArray(tmp) ? tmp : new Array(tmp)
      return [...acc, ...tmp]
  }, [] as JSX.Element[])

  const formItemAddId = `${key}`;
  const formItemRemoveLastId = `${key}`; 

  return [
    <fieldset key={`${key}.fieldset`}>
    <legend key={`${key}.legend`}>{formatTitle(key)}</legend>
        {formFields}
    <div css={{marginTop: "5px"}}>
      <button type="button" id={`${key}.add`} onClick={() => handleAddField(formItemAddId, formFieldsSchema, dispatcher)}>+  {key.split('.').slice(-1)[0]}</button>
      <button type="button" id={`${key}.remove`} onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}>-  {key.split('.').slice(-1)[0]}</button>
    </div>
    </fieldset>
  ]
}

function getFormFields(formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown>, schema: schemaItem, key: string, dispatcher:Dispatch<ActionType>): JSX.Element[] {
  // Get form components for each item in `formItems`
  const  choices = schema.enum || null;
  // Recursively parse all elements in JSON tree
  if (getSchemaType(schema.type).includes("null") && formItems === null){
    return [] as JSX.Element[];
  } else if (getSchemaType(schema.type).includes("string") && typeof isStringOrNumber(formItems)) {
    // String -> single form field
    return [<FormItem text={formItems} choices={choices} label={key} key={`${key}.formItem`} dispatcher={dispatcher} > </FormItem>]
  } else if (getSchemaType(schema.type).includes("array") && Array.isArray(formItems)) {
    // Array -> process each element recursively
    return formItems.map( (item:schemaItem, i:int) => {
      return getFormFields(item, schema.items, key+'.'+String(i), dispatcher)
    });
  } else if (getSchemaType(schema.type).includes("object") && typeof formItems === 'object') {
    // HashMap -> create new form group
    return renderFormGroup(formItems, schema.properties, `${key}`, dispatcher)
  } else {
    console.warn("Cannot get item in formItems.")
    return [] as JSX.Element[];
  }
}

function getFormFieldsSchema(formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown>, schema: schemaItem): schemaItem {
  // Get schema for contents of given formItem
  if (getSchemaType(schema.type).includes("string")) {
    return {"type": "string"} as schemaItem
  } else if (getSchemaType(schema.type).includes("array")) {
    return schema.items
  } else if (getSchemaType(schema.type).includes("object")) {
    return schema.properties
  } else {
    return {"type": "null"} as schemaItem
  }
}

export class FormGroup extends Component<FormGroupProps> {
  constructor(props: FormGroupProps) {
    super(props);
  }

  render(): React.Component|JSX.Element {
      const { formItems, schema, title } = this.props;
      const  choices = schema.enum || null;
      const key = this.props.key_ || title;
      const dispatcher = this.props.dispatcher || null;

      const formFields = getFormFields(formItems, schema, key, dispatcher)
      const formFieldsSchema = getFormFieldsSchema(formItems, schema)
      const formItemAddId = `${key}.${formFields.length}`;
      const formItemRemoveLastId = `${key}.${formFields.length-1}`; 

      const formFieldStyle = {
        minWidth: "500px",
        gridArea: "field",
        display: "grid",
        width: "max-content"
      }
      
      return (
        <fieldset key={`${key}.fieldset`} css={{}}>
        <legend key={`${key}.legend`}>{formatTitle(title)}</legend>
            {formFields}
          <div css={{marginTop: "5px"}}>
            <button type="button" id={`${key}.add`} onClick={() => handleAddField(formItemAddId, formFieldsSchema, dispatcher)}>+  {key.split('.').slice(-1)[0]}</button>
            <button type="button" id={`${key}.remove`} onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}>-  {key.split('.').slice(-1)[0]}</button>
          </div>
        </fieldset>
        ) 
  }
}
