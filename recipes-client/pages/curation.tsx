/** @jsx jsx */
import { jsx } from "@emotion/core";

import RecipeComponent from "~components/recipe-component";
// import GuFrame from "~/components/gu-frame";
import GuCAPIFrame from "~/components/gu-capi-frame";
import ImagePicker from "~components/image-picker";
import Footer from "~components/footer";
import Header from "~components/header";

import {articlePath, defaultHighlightColours} from "~consts/index";
import { RouteComponentProps } from 'react-router-dom';


import { recipeReducer, defaultState } from "~reducers/recipe-reducer";
import { actions } from "~actions/recipeActions";
import {apiURL, capiProxy, schemaEndpoint} from "~consts/index";
import { Dispatch, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { ActionType } from "~components/interfaces";

interface CurationProps {
  articleId: string;
}

interface RouteParams {
    articleId: string;
}

function updateColours(){
  console.log("Update Colours.");
}

function fetchAndDispatch(url: string, action: string, payloadType: string, 
                          dispatcher: Dispatch<ActionType>):void {
  fetch(url).then((response) => {return response.json<{ data: Record<string,unknown>}>()})
  .then((data: Record<string,unknown>) => dispatcher({"type": action, "payload": {payloadType : data }}))
  .catch(() => dispatcher({"type": actions.error, "payload": `Error fetching ${payloadType} data.`}) );
}

function setLoadingFinished(dispatcher: Dispatch<ActionType>): void {
  dispatcher({"type": actions.init, "payload": {'isLoading': false}})
}

function Curation(props: RouteComponentProps<RouteParams>): JSX.Element{
  const {articleId} = props.match.params;
  const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);
  const image = (state.body === null) ? null : state.body.image;

  useEffect( () => {
    const articleUrl = articleId.replace(/^\/+/, '');
    // Set default colours
    dispatch({"type": actions.changeColours, "payload": {colours: defaultHighlightColours}});

    // Get schema
    // await Promise.all([
    // fetchAndDispatch(`${location.origin}${apiURL}${schemaEndpoint}`, actions.init, "schema", dispatch),
    fetch(`${location.origin}${apiURL}${schemaEndpoint}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {schema: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching schema data."}) );

    // Get parsed recipe items
    // fetchAndDispatch(`${location.origin}${apiURL}${articleUrl}`, actions.init, "body", dispatch),
    fetch(`${location.origin}${apiURL}${articleUrl}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {isLoading: true, body: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching recipe data."}) );

    // Get article content
    // fetchAndDispatch(`${location.origin}${capiProxy}${articleUrl}`, actions.init, "html", dispatch)]
    fetch(`${location.origin}${capiProxy}${articleUrl}`)
    .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
    .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {isLoading: false, html: data}}))
    .catch(() => dispatch({"type": actions.error, "payload": "Error fetching HTML body data."}) );
    // ).then( setLoadingFinished(dispatch) );
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
        <Header recipeUrl={articlePath} colours={state.colours} dispatcher={dispatch} />
      </div>
      <div css={{ gridArea: "left", background: "white", overflow: "auto", padding: "5px" }}>
          {/* <GuFrame articlePath={articlePath} /> */}
          <GuCAPIFrame articlePath={articlePath} isLoading={state.isLoading} html={state.html} recipeItems={state.body} colours={state.colours} />
      </div>
      <div css={{ gridArea: "right", background: "grey", overflow: "auto", padding: "5px" }}>
        <ImagePicker html={state.html} selected={image} isLoading={state.isLoading} dispatcher={dispatch} />
        <form>
          <RecipeComponent isLoading={state.isLoading} body={state.body} schema={state.schema} dispatcher={dispatch}/>
        </form>
      </div>
      <div css={{ gridArea: "footer", background: "green", justifyItems: "center", display: "grid", align: "center"}}>
        <Footer articleId={articlePath} body={state.body} dispatcher={dispatch}/>
      </div>
    </div>
  );
}

export default Curation;