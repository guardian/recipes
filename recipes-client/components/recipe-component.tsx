/** @jsx jsx */
import { Dispatch } from "react";
import { jsx } from "@emotion/core";
// import FormGroup from "~components/form-group";
import { ActionType, schemaType, allRecipeFields} from "~components/interfaces";
import { renderFormGroup } from "~components/form-group";
import filter from "lodash-es/filter";

import {excludeInForm} from '~consts/index';

interface RecipeComponentProps {
  body: allRecipeFields;
  schema: schemaType;
  isLoading: boolean;
  dispatcher: Dispatch<ActionType>;
}

function RecipeComponent(props: RecipeComponentProps): JSX.Element|JSX.Element[]{
  const { body, isLoading, schema, dispatcher } = props;

  if (schema === null){
    return <h3> No schema loaded... </h3>
  } else if (isLoading){
    return <h3> LOADING... </h3>
  } else if (body === undefined || body === null){
    return <h3> No bodayyyyy</h3>
  } else {
    return (
      filter(Object.entries(body), (item) => {return !excludeInForm.includes(item[0]);}
      ).map( (k: ArrayLike<Record<string, unknown>>) => {
          return renderFormGroup(k[1], k[0], schema.properties[k[0]], k[0], dispatcher)
        })
    )
  }
}

export default RecipeComponent;

