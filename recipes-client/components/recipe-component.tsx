/** @jsx jsx */
import { Dispatch } from "react";
import { jsx } from "@emotion/core";
// import FormGroup from "~components/form-group";
import { ActionType, schemaItem, allRecipeFields, isingredientListFields} from "~interfaces/main";
import { FormGroup } from "~components/form-group";
import filter from "lodash-es/filter";

import {excludeInForm} from '~consts/index';

interface RecipeComponentProps {
  body: allRecipeFields;
  schema: schemaItem|null;
  isLoading: boolean;
  dispatcher: Dispatch<ActionType>;
}

function RecipeComponent(props: RecipeComponentProps): JSX.Element|JSX.Element[]{
  const { body, isLoading, schema, dispatcher } = props;

  if (isLoading) {
    return <h3> LOADING... </h3>
  } else if (schema === null || schema.properties === undefined) {
    return <h3> No schema loaded... </h3>
  } else if (body === undefined || body === null) {
    return <h3> No bodayyyyy</h3>
  } else {
    return (
      filter(Object.entries(body), (item) => {return !excludeInForm.includes(item[0]);}
        ).map( ([key, fI]: [keyof allRecipeFields, Record<string, unknown>]) => {
          if (isingredientListFields(schema.properties)) {
            return <span/>
          } else {
            return <FormGroup formItems={fI} schema={schema.properties[key]} key_={key} title={key} dispatcher={dispatcher} key={key}></FormGroup>
          }
        })
    )
  }
}

export default RecipeComponent;

