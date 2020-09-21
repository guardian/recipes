/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";

import RecipeComponent from "~components/recipe-component";
import GuFrame from "~/components/gu-frame"

import {articlePath, apiURL, schemaEndpoint} from "~consts/index";
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


class Curation extends Component<RouteComponentProps<RouteParams>, CurationState> {
  constructor(props: RouteComponentProps<RouteParams>){
    super(props);
    this.state = {isLoading: true, 
                  body: null, 
                  schema: null };
  }

  
  componentDidMount(): void {
    fetch(`${location.origin}${apiURL}${schemaEndpoint}`)
      .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
      .then((data: Record<string,unknown>) => this.setState({loading: true, schema: data}))
      .catch(() => console.error("Failed to fetch schema."));
  }

  componentDidUpdate(): void {
    const {articleId} = this.props.match.params;
    fetch(`${location.origin}${apiURL}${articleId}`)
      .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
      .then((data: Record<string,unknown>) => this.setState({loading: false, body: data}))
      .catch(() => console.error("Failed to fetch recipe data."));
  }

  render(): JSX.Element {
    const body = this.state.body;
    const schema = this.state.schema;

    // ["path", "recipe_title", ....]
    return (
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "25% 25% 25% 25%",
          gridTemplateRows: "auto",
          gridTemplateAreas: `"header header header header" "left left right right" "footer footer footer footer"`,
        }}
      >
        <div css={{ gridArea: "header", background: "red" }}>header</div>
        <div css={{ gridArea: "left", background: "blue" }}>
            <GuFrame articlePath={articlePath} />
        </div>
        <div css={{ gridArea: "right", background: "yellow" }}>
          <form>
            <RecipeComponent title="hello" body={body} schema={schema}/>
          </form>
        </div>
        <div css={{ gridArea: "footer", background: "green" }}>buttons</div>
      </div>
    );
  }
}
export default Curation;
// export const CurationComponent = withRouter(Curation);
