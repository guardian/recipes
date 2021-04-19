/** @jsx jsx */
import { Component, Dispatch } from "react";
import { jsx } from "@emotion/core";
import FormItem from "./form-item";
import { ActionType, schemaItem } from "~interfaces/main";
import {actions} from "~actions/recipeActions";
import { getSchemaType } from "~utils/schema";
import { UIItem, UIschemaItem } from "~interfaces/ui";
import { isRemovable } from "~consts";
import { orderComponents } from "~utils/ordering";

function isStringOrNumber(item: string | Array<string|Record<string, unknown>> | Record<string, unknown>){
  return (typeof item === "string" || typeof item === "number")
}

export function formatTitle(text: string|null){
    // Reformat title with first letter uppercase
    if (text === null){
        return null;
    } else {
        const title = text.replace('_', ' ');
        return <legend> {title[0].toUpperCase() + title.slice(1)} </legend>
    }
}

function getLabel(lab:string): string {
  return lab.split('.').reverse().reduce( (acc, l) => {
    if (acc.length > 0) {
      return acc
    } else {
      return isFinite(l) ? acc : l
    }
  }, "")
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
    UIschema: UIItem
    title: string
    key_?: string|null
    dispatcher?: Dispatch<ActionType>|null
}

export function renderFormGroup(fI: Record<string, string>, schema: schemaItem, UIschema:UIschemaItem, key: string, dispatcher?:Dispatch<ActionType>): JSX.Element[]{
  // Return FormGroup JSX, this is mainly because TS has an issue with an inline component that can have multiple types as input  ¯\_(ツ)_/¯
  const formFields = Object.entries(fI).reduce((acc, [k, val]) => {
      const tmp = getFormFields(val, schema[k], UIschema[k], k, dispatcher)
      return [...acc, ...tmp]
  }, [] as JSX.Element[])
  const formFieldsSchema = getFormFieldsSchema(fI, schema)
  const formItemAddId = `${key}`;
  const formItemRemoveLastId = `${key}`;
  const removable = (schema.properties === undefined && schema.quantity === undefined) ? false : true; 

  return [
    <fieldset key={`${key}.fieldset`}>
    <legend key={`${key}.legend`}>{formatTitle(key)}</legend>
        {formFields}
    {removable && 
      <div css={{marginTop: "5px"}}>
      <button type="button" id={`${key}.add`} onClick={() => handleAddField(formItemAddId, formFieldsSchema, dispatcher)}>+  {getLabel(key)}</button>
      <button type="button" id={`${key}.remove`} onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}>-  {getLabel(key)}</button>
    </div>}
    </fieldset>
  ]
}

function getFormFields(formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown>, schema: schemaItem, UIschema:UIschemaItem, key: string, dispatcher:Dispatch<ActionType>): JSX.Element[] {
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
      const rComponents = UIschema['ui:order'] ? orderComponents(item, UIschema['ui:order']) : item
      return getFormFields(rComponents, schema.items, UIschema, key+'.'+String(i), dispatcher)
    });
  } else if (getSchemaType(schema.type).includes("object") && typeof formItems === 'object') {
    // HashMap -> create new form group
    const rComponents = UIschema['ui:order'] ? orderComponents(formItems, UIschema['ui:order']) : formItems
    return renderFormGroup(rComponents, schema.properties, UIschema, `${key}`, dispatcher)
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
    const { formItems, schema, title, UIschema } = this.props;
    const  choices = schema.enum || null;
    const key = this.props.key_ || title;
    const dispatcher = this.props.dispatcher || null;

    // Set up form group
    const rComponents = UIschema['ui:order'] && !Array.isArray(formItems) ? orderComponents(formItems, UIschema['ui:order']) : formItems
    const formFields = getFormFields(rComponents, schema, UIschema, key, dispatcher)
    const isFormItemRemovable = isRemovable(key)

    // Set up buttons under form group
    const formFieldsSchema = getFormFieldsSchema(rComponents, schema)
    const formItemAddId = `${key}.${formFields.length}`;
    const formItemRemoveLastId = `${key}.${formFields.length-1}`;
    const formItemButtons = 
      <div css={{marginTop: "5px"}}>
        <button type="button" id={`${key}.add`} onClick={() => handleAddField(formItemAddId, formFieldsSchema, dispatcher)}>+  {key.split('.').slice(-1)[0]}</button>
        <button type="button" id={`${key}.remove`} onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}>-  {key.split('.').slice(-1)[0]}</button>
      </div>
    

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
        {isFormItemRemovable && formItemButtons }
      </fieldset>
    ) 
  }
}
