/** @jsx jsx */
import { useEffect, Dispatch } from "react";
import { useImmerReducer } from "use-immer";
import { jsx } from "@emotion/core";
import FormGroup from "~components/form-group";
import { recipeReducer, defaultState } from "~reducers/recipe-reducer";
import { actions } from "~actions/recipeActions";
import { ActionType, schemaItem, schemaType} from "~components/interfaces";


import {apiURL, schemaEndpoint} from "~consts/index";

// const RecipeContext = createContext();

function renderFGO(fI: Array<string|Record<string, unknown>> | Record<string, unknown>, title: string, schema: schemaItem, key_:number, dispatcher: Dispatch<ActionType>){
  return <FormGroup formItems={fI} title={title} schema={schema} key={key_} dispatcher={dispatcher}></FormGroup>
}

interface RecipeComponentProps2 {
  articleId: string
}

interface RecipeComponentProps {
  title: string
  body: Record<string, unknown>|null
  schema: schemaType
  isLoading: boolean
}

// interface schemaItem {
//   type: string;
//   items?: Record<string, unknown>;
//   properties?: Record<string, unknown>;
// }

// // What's the point of having a fetch-ed schema then?
// interface schemaType {
//   'properties': {
//   "path": schemaItem;
//   "recipes_title": schemaItem;
//   "serves": schemaItem;
//   "time": schemaItem;
//   "steps": schemaItem;
//   "credit": schemaItem;
//   "ingredients_lists": schemaItem;
//   "occasion": schemaItem;
//   "cuisines": schemaItem;
//   }
// }

function RecipeComponent(props: RecipeComponentProps2): JSX.Element|JSX.Element[]{
  // const [state, dispatch] = useReducer(recipeReducer, defaultState);
  const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);
  const { body, isLoading, schema } = state;
  // const isLoading = state.isLoading;
  // const schema: schemaType = state.schema;
  const {articleId} = props;

  useEffect((aId: string) => {
    fetch(`${location.origin}${apiURL}${schemaEndpoint}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {schema: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching schema data."}) );
    fetch(`${location.origin}${apiURL}${aId}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {isLoading: false, body: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching body data."}) );
  }, [articleId]);


  if (schema === null){
    return <h3> No schema loaded... </h3>
  } else if (isLoading){
    return <h3> LOADING... </h3>
  } else if (body === undefined){
    return <h3> No bodayyyyy</h3>
  } else {
    return (
        Object.entries(body).map( (k: ArrayLike<Record<string, unknown>>, i:int) => {
          return renderFGO(k[1], k[0], schema.properties[k[0]], i, dispatch)
        })
    )
  }
}

// class RecipeComponent extends Component<RecipeComponentProps> {
//   constructor(props: RecipeComponentProps) {
//     super(props);
//   }
//   render(): React.Component|JSX.Element{ //}: React.Component|JSX.Element {
//     if (this.props.schema === null){
//       return <h3> No schema loaded... </h3>
//     } else if (this.props.isLoading){
//       return <h3> LOADING... </h3>
//     } else {
//       const body = this.props.body;
//       const schema: schemaType = this.props.schema;
//       return Object.entries(body).map( (k: ArrayLike<Record<string, unknown>>, i:int) => {
//         return renderFGO(k[1], k[0], schema.properties[k[0]], i)
//       })
//     }
//   }
// }

// export const useRecipe = () => {
//   const contextValue = useContext(RecipeContext);
//   return contextValue;
// };

export default RecipeComponent;

