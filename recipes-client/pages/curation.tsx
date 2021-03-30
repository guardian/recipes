/** @jsx jsx */
import { jsx } from "@emotion/core";

import RecipeComponent from "~components/recipe-component";
// import GuFrame from "~/components/gu-frame";
import GuCAPIFrame from "~/components/gu-capi-frame";
import ImagePicker from "~components/image-picker";
import Footer from "~components/footer";
import Header from "~components/header";

// import { defaultHighlightColours } from "~consts/index";
import { RouteComponentProps } from 'react-router-dom';


import { recipeReducer, defaultState } from "~reducers/recipe-reducer";
import { actions } from "~actions/recipeActions";
import {apiURL, capiProxy, schemaEndpoint} from "~consts/index";
import { Dispatch, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { ActionType, AddRemoveItemType, AppDataState, ErrorItemType } from "~interfaces/main";

interface CurationProps {
  articleId: string;
}

interface RouteParams {
    articleId: string;
}

async function fetchAndDispatch(url: string, action: string, payloadType: string, 
  dispatcher: Dispatch<ActionType>): Promise<void> {
  
  const payload: { [id: string] : AppDataState|AddRemoveItemType|ErrorItemType } = {};
  return fetch(url).then((response) => {
    return response.json()
    }).then((data: Record<string,AppDataState|AddRemoveItemType>|ErrorItemType) => {
      payload[payloadType] = data;
      dispatcher({"type": action, "payload": payload });
    }).catch(() => dispatcher({"type": actions.error, "payload": `Error fetching ${payloadType} data.`}) );
}

function setLoadingFinished(dispatcher: Dispatch<ActionType>): void {
  dispatcher({"type": actions.init, "payload": {'isLoading': false}})
}

function Curation(props: RouteComponentProps<RouteParams>): JSX.Element{
  const {articleId} = props.match.params;
  const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);
  const image = (state.body === null) ? null : state.body.image;
  const recipeId = state.body === null ? null : state.body.recipeId;
  const articlePath = state.body === null ? articleId : state.body.path;

  useEffect( () => {
    const articleUrl = articleId.replace(/^\/+/, '');
    Promise.all([
    // Get schema
      fetchAndDispatch(`${location.origin}${apiURL}${schemaEndpoint}`, actions.init, "schema", dispatch),
      // Get parsed recipe items
      fetchAndDispatch(`${location.origin}/api/db/${articleUrl}`, actions.init, "body", dispatch),
      // Get article content
      fetchAndDispatch(`${location.origin}${capiProxy}${articleUrl}`, actions.init, "html", dispatch)
    ]).then( () => setLoadingFinished(dispatch) ).catch((err) => {console.error(err);});
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
        <Header recipeUrl={articlePath} recipeNumber={recipeId} colours={state.colours} dispatcher={dispatch} />
      </div>
      <div css={{ gridArea: "left", background: "white", overflow: "auto", padding: "5px" }}>
          {/* <GuFrame articlePath={articleId} /> */}
          <GuCAPIFrame articlePath={articlePath} isLoading={state.isLoading} html={state.html} recipeItems={state.body} schema={state.schema} colours={state.colours} />
      </div>
      <div css={{ gridArea: "right", background: "grey", overflow: "auto", padding: "5px" }}>
        <ImagePicker html={state.html} selected={image} isLoading={state.isLoading} dispatcher={dispatch} />
        <form>
          <RecipeComponent isLoading={state.isLoading} body={state.body} schema={state.schema} dispatcher={dispatch}/>
        </form>
      </div>
      <div css={{ gridArea: "footer", background: "green", justifyItems: "center", display: "grid", align: "center"}}>
        <Footer articleId={articleId} body={state.body} dispatcher={dispatch}/>
      </div>
    </div>
  );
}

export default Curation;