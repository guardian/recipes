/** @jsx jsx */
import { Component, Dispatch } from "react";
import { jsx } from "@emotion/core";
import FormItem from "./form-item";
import { ActionType, ingredientField, ingredientListFields, isingredientQuantityField, isingredientField, isingredientListFields, schemaItem, schemaType, ingredientQuantityField } from "~interfaces/main";
import {actions} from "~actions/recipeActions";
import { getSchemaType } from "~utils/schema";
import { UIItem, UIschemaItem } from "~interfaces/ui";
import { isRemovable } from "~consts";
import { orderComponents } from "~utils/ordering";

function isStringOrNumber(item: string | Array<string|Record<string, unknown>> | Record<string, unknown>){
  return (typeof item === "string" || typeof item === "number")
}

export function formatTitle(text: string|null): JSX.Element|null{
    // Reformat title with first letter uppercase
    if (text === null){
        return null;
    } else {
        const title = text.replace('_', ' ');
        return <legend> {title[0].toUpperCase() + title.slice(1)} </legend>
    }
}

function getLabel(lab:string): string {
  // Utility to get text label removing any numbers
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

export function getItemButtons(key: string, formItemAddId: string, formItemRemoveLastId: string, formFieldsSchema: schemaItem, dispatcher: Dispatch<ActionType>|null): JSX.Element {
  return (
  <div css={{marginTop: "5px"}}>
    <button type="button" id={`${key}.add`} onClick={() => handleAddField(formItemAddId, formFieldsSchema, dispatcher)}>+  {key.split('.').slice(-1)[0]}</button>
    <button type="button" id={`${key}.remove`} onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}>-  {key.split('.').slice(-1)[0]}</button>
  </div>
  )
}

interface FormGroupProps {
    formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown>
    schema: schemaItem
    UIschema: UIItem
    title: string
    key_?: string|null
    dispatcher?: Dispatch<ActionType>|null
}

function getFormFields(formItems: string | Array<string|Record<string, unknown>> | Record<string, unknown> | ingredientListFields, schema: schemaItem, UIschema:UIschemaItem, key: string, dispatcher:Dispatch<ActionType>): JSX.Element[] {
  // Get form components for each item in `formItems`
  const  choices = schema.enum || null;
  // Recursively parse all elements in JSON tree
  if (getSchemaType(schema.type).includes("null") && formItems === null){
    return [] as JSX.Element[];
  } else if (getSchemaType(schema.type).includes("string") && isStringOrNumber(formItems)) {
    // String -> single form field
    return [<FormItem text={formItems} choices={choices} label={key} key={`${key}.formItem`} dispatcher={dispatcher} > </FormItem>]
  } else if (getSchemaType(schema.type).includes("array") && Array.isArray(formItems)) {
    // Array -> process each element recursively
    return formItems.map( (item:schemaItem, i:int) => {
      const rComponents = UIschema['ui:order'] ? orderComponents(item, UIschema['ui:order']) : item
      return getFormFields(rComponents, schema.items, UIschema, key+'.'+String(i), dispatcher)
    });
  } else if (isingredientListFields(formItems) && getSchemaType(schema.type).includes("object") ) {
    // ingredient list object
    const rComponents = UIschema['ui:order'] ? orderComponents(formItems, UIschema['ui:order']) : formItems
    return Object.keys(rComponents).map(cKey => {
      return cKey === 'title' ? <FormItem text={rComponents[cKey]} choices={choices} label={cKey} key={`${cKey}.formItem`} dispatcher={dispatcher} /> :
        getFormFields(rComponents[cKey], schema.properties[cKey], UIschema[cKey], `${key}.${cKey}`, dispatcher)
    })
  } else if (isingredientQuantityField(formItems)) {
    // ingredient quantity object
    return Object.keys(formItems).map((k: keyof ingredientQuantityField) => {
      return <FormItem text={formItems[k]} choices={choices} label={`Quantity:${k}`} key={`${key}.${k}`} dispatcher={dispatcher} > </FormItem>
    })
  } else if (isingredientField(formItems)) {
    // ingredient field object
    // return renderIngredientField(formItems, schema, key, dispatcher);
    const formItemAddId = `${key}`;
    const formItemRemoveLastId = `${key}`;
    const fields = Object.keys(formItems).map((k: keyof ingredientField) => {
      if (k === "quantity"){
        return getFormFields(formItems.quantity, schema.properties.quantity, UIschema.quantity, `${key}.quantity`, dispatcher);
      } else {
        return <FormItem text={formItems[k]} choices={choices} label={k} key={`${key}.${k}`} dispatcher={dispatcher} > </FormItem>
      }
    })
    return [
      <fieldset key={`${key}.fieldset`} css={{}}>
      <legend key={`${key}.legend`}>{formatTitle(key)}</legend>
          {fields}
          {getItemButtons(key, formItemAddId, formItemRemoveLastId, schema, dispatcher) }
      </fieldset>
    ]
  } else {
    console.warn(`Cannot get item '${key}' in formItems, leaving field empty.`)
    return [] as JSX.Element[];
  }
}

function renderIngredientField(formItems: ingredientField, schema: schemaType, UIschema: UIschemaItem, key: string, dispatcher: Dispatch<ActionType>): JSX.Element[] {
  const formItemAddId = `${key}`;
  const formItemRemoveLastId = `${key}`;
  const fields = Object.keys(formItems).map((k: keyof ingredientField) => {
    if (k === "quantity"){
      return getFormFields(formItems.quantity, schema.properties.quantity, UIschema.quantity, `${key}.quantity`, dispatcher);
    } else {
      return <FormItem text={formItems[k]} choices={null} label={k} key={`${key}.${k}`} dispatcher={dispatcher} > </FormItem>
    }
  })
  return [
    <fieldset key={`${key}.fieldset`} css={{}}>
    <legend key={`${key}.legend`}>{formatTitle(key)}</legend>
        {fields}
        {getItemButtons(key, formItemAddId, formItemRemoveLastId, schema, dispatcher) }
    </fieldset>
  ]
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
    return schema//{"type": "null"} as schemaItem
  }
}

export class FormGroup extends Component<FormGroupProps> {
  constructor(props: FormGroupProps) {
    super(props);
  }

  render(): React.Component|JSX.Element {
    const { formItems, schema, title, UIschema } = this.props;
    // const  choices = schema.enum || null;
    const key = this.props.key_ || title;
    const dispatcher = this.props.dispatcher || null;

    // Set up form group
    const rComponents = UIschema['ui:order'] && !Array.isArray(formItems) ? orderComponents(formItems, UIschema['ui:order']) : formItems
    const formFields = getFormFields(rComponents, schema, UIschema, key, dispatcher)
    const isFormItemRemovable = isRemovable(getLabel(key))

    // Set up buttons under form group
    const formFieldsSchema = getFormFieldsSchema(rComponents, schema)
    const formItemAddId = `${key}.${formFields.length}`;
    const formItemRemoveLastId = `${key}.${formFields.length-1}`;
    const formItemButtons = getItemButtons(key, formItemAddId, formItemRemoveLastId, formFieldsSchema, dispatcher) 

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