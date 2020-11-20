/** @jsx jsx */
import { jsx } from "@emotion/core";

import RecipeComponent from "~components/recipe-component";
import GuFrame from "~/components/gu-frame";
import Footer from "~components/footer";
import Header from "~components/header";

import {articlePath} from "~consts/index";
import { RouteComponentProps } from 'react-router-dom';


import { recipeReducer, defaultState } from "~reducers/recipe-reducer";
import { actions } from "~actions/recipeActions";
import {apiURL, schemaEndpoint} from "~consts/index";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";

interface CurationProps {
  articleId: string;
}

interface CurationState {
  isLoading: boolean;
  body: Record<string, unknown>|null; 
  schema: Record<string, unknown>|null;
}

interface RouteParams {
    articleId: string;
}


function Curation(props: RouteComponentProps<RouteParams>): JSX.Element{
  const {articleId} = props.match.params;
  const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);

  useEffect( () => {
    fetch(`${location.origin}${apiURL}${schemaEndpoint}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {schema: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching schema data."}) );
    const articleUrl = articleId.replace(/^\/+/, '');
    fetch(`${location.origin}${apiURL}${articleUrl}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {isLoading: false, body: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching body data."}) );
  }, [articleId, dispatch]);

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "25% 25% 25% 25%",
        // gridTemplateRows: "auto",
        height: "100vh",
        gridTemplateRows: "40px 1fr 30px",
        gridTemplateAreas: `"header header header header" "left left right right" "footer footer footer footer"`,
      }}
    >
      <div css={{ gridArea: "header", background: "red", justifyItems: "center", display: "grid", align: "center" }}>
        <Header recipeUrl={articlePath}/>
      </div>
      <div css={{ gridArea: "left", background: "blue", overflow: "auto" }}>
          <GuFrame articlePath={articlePath} />
      </div>
      <div css={{ gridArea: "right", background: "yellow", overflow: "auto" }}>
        <form>
          <RecipeComponent articleId={articlePath} isLoading={state.isLoading} body={state.body} schema={state.schema} dispatcher={dispatch}/>
        </form>
      </div>
      <div css={{ gridArea: "footer", background: "green", justifyItems: "center", display: "grid", align: "center"}}>
        <Footer articleId={articlePath} body={state.body} dispatcher={dispatch}/>
      </div>
    </div>
  );
}

export default Curation;