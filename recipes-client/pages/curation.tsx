/** @jsx jsx */
import { jsx } from "@emotion/core";

import RecipeComponent from "~components/recipe-component";
import GuFrame from "~/components/gu-frame";
import Footer from "~components/footer";
import Header from "~components/header";

import {articlePath} from "~consts/index";
import { RouteComponentProps } from 'react-router-dom';


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
          <RecipeComponent articleId={articlePath}/>
        </form>
      </div>
      <div css={{ gridArea: "footer", background: "green", justifyItems: "center", display: "grid", align: "center"}}>
        <Footer />
      </div>
    </div>
  );
}

export default Curation;