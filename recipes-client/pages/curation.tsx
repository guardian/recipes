/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { space } from '@guardian/src-foundations';
import { background, text } from '@guardian/src-foundations/palette';
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
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { fetchAndDispatch, setLoadingFinished } from "~utils/requests";

// Styles

const gridLayout = css`
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  height: 100vh;
  grid-template-rows: 70px 1fr 50px;
  grid-template-areas: "header header header header" "left left right right" "footer footer footer footer";
`;

const header = css`
  grid-area: header;
  background: ${background.ctaPrimary};
  color: ${text.ctaPrimary};
  display: grid;
  align-items: center;
  padding-left: ${space[5]}px;
`;

const articleView = css`
  grid-area: left;
  background: ${background.primary};
  overflow: auto;
  padding: ${space[5]}px;
`;

const dataView = css`
  grid-area: right;
  background: grey;
  overflow: auto;
  padding: 5px;
`;

const footer = css`
  grid-area: footer;
  background: ${background.ctaPrimary};
  justify-items: center;
  display: grid;
  align-items: center;
`;

// Types

interface CurationProps {
  articleId: string;
}

interface RouteParams {
  articleId: string;
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
    <div css={gridLayout}>
      <div css={header}>
        <Header
          recipeUrl={articlePath}
          recipeNumber={recipeId}
          colours={state.colours}
          dispatcher={dispatch}
        />
      </div>
      <div css={articleView}>
          {/* <GuFrame articlePath={articleId} /> */}
          <GuCAPIFrame
            articlePath={articlePath}
            isLoading={state.isLoading}
            html={state.html}
            recipeItems={state.body}
            schema={state.schema}
            colours={state.colours}
          />
      </div>
      <div css={dataView}>
        <ImagePicker
          html={state.html}
          selected={image}
          isLoading={state.isLoading}
          dispatcher={dispatch}
        />
        <form>
          <RecipeComponent
            isLoading={state.isLoading}
            body={state.body}
            schema={state.schema}
            dispatcher={dispatch}
          />
        </form>
      </div>
      <div css={footer}>
        <Footer articleId={articleId} body={state.body} dispatcher={dispatch}/>
      </div>
    </div>
  );
}

export default Curation;
