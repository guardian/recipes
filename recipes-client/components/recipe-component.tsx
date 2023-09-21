/** @jsxImportSource @emotion/react */
import { Dispatch } from "react";
import { ActionType, schemaItem, allRecipeFields, isschemaType } from "../interfaces/main";
import { FormGroup } from "../components/form-group";

import { isDisplayed, UIschema } from '../consts/index';
import { isUIschemaItem } from "../interfaces/ui";
import { orderComponents } from "../utils/ordering";

interface RecipeComponentProps {
  body: allRecipeFields;
  schema: schemaItem | null;
  isLoading: boolean;
  dispatcher: Dispatch<ActionType>;
}

function RecipeComponent(props: RecipeComponentProps): JSX.Element | JSX.Element[] {
  const { body, isLoading, schema, dispatcher } = props;
  const UIOrder = isUIschemaItem(UIschema) ? UIschema['ui:order'] : null;

  if (isLoading) {
    return <h3> LOADING... </h3>
  } else if (schema === null || schema.properties === undefined) {
    return <h3> No schema loaded... </h3>
  } else if (body === undefined || body === null) {
    return <h3> No bodayyyyy</h3>
  } else {
    const recipeComponents = UIOrder ? orderComponents(body, UIOrder) : body;
    return Object.keys(recipeComponents).reduce((acc, key: keyof allRecipeFields) => {
      if (isDisplayed(key) && isschemaType(schema)) {
        return [...acc,
        <FormGroup formItems={body[key]} schema={schema.properties[key]} UIschema={UIschema[key]} key_={key} title={key} dispatcher={dispatcher} key={key}></FormGroup>
        ]
      } else {
        return [acc]
      }
    }, [] as JSX.Element[])
  }
}

export default RecipeComponent;

