/** @jsx jsx */
// import { Component, useEffect, useReducer } from "react";
import { jsx } from "@emotion/core";

import RecipeComponent from "~components/recipe-component";
import GuFrame from "~/components/gu-frame";
import Footer from "~components/footer";
import Header from "~components/header";

import {articlePath} from "~consts/index";
import { RouteComponentProps } from 'react-router-dom';
// import { recipeReducer, defaultState } from "~reducers/recipeReducer";
// import { actions } from "~actions/recipeActions";

// const [state, dispatch] = useReducer(reducer, this.state);

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
  // const [state, dispatch] = useReducer(recipeReducer, defaultState);
  // const body = state.body;
  // const isLoading = state.isLoading;
  // const schema = state.schema;
  const {articleId} = props.match.params;

  // useEffect((articleId) => {
  //   fetch(`${location.origin}${apiURL}${schemaEndpoint}`)
  //   .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
  //   .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {schema: data}}))
  //   .catch(() => dispatch({"type": actions.error, "payload": "Error fetching schema data."}) );
  //   fetch(`${location.origin}${apiURL}${articleId}`)
  //   .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
  //   .then((data: Record<string,unknown>) => dispatch({"type": actions.init, "payload": {isLoading: false, body: data}}))
  //   .catch(() => dispatch({"type": actions.error, "payload": "Error fetching body data."}) );
  // }, []);
  

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



// class Curation extends Component<RouteComponentProps<RouteParams>, CurationState> {
//   constructor(props: RouteComponentProps<RouteParams>){
//     super(props);
//     this.state = {isLoading: true, 
//                   body: null, 
//                   schema: null };
//   }

  
//   componentDidMount(): void {
//     fetch(`${location.origin}${apiURL}${schemaEndpoint}`)
//       .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
//       .then((data: Record<string,unknown>) => this.setState({schema: data}))
//       .catch(() => this.setState({schema: null, isLoading: false}) );
//     const {articleId} = this.props.match.params;
//     fetch(`${location.origin}${apiURL}${articleId}`)
//       .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
//       .then((data: Record<string,unknown>) => this.setState({isLoading: false, body: data}))
//       .catch(() => this.setState({body: null, isLoading: false}) );
//   }

//   render(): JSX.Element {
//     const body = this.state.body;
//     const schema = this.state.schema;
//     const isLoading = this.state.isLoading;

//     return (
//       <div
//         css={{
//           display: "grid",
//           gridTemplateColumns: "25% 25% 25% 25%",
//           // gridTemplateRows: "auto",
//           height: "100vh",
//           gridTemplateRows: "40px 1fr 30px",
//           gridTemplateAreas: `"header header header header" "left left right right" "footer footer footer footer"`,
//         }}
//       >
//         <div css={{ gridArea: "header", background: "red", justifyItems: "center", display: "grid", align: "center" }}>
//           <Header recipeUrl={articlePath}/>
//         </div>
//         <div css={{ gridArea: "left", background: "blue", overflow: "auto" }}>
//             <GuFrame articlePath={articlePath} />
//         </div>
//         <div css={{ gridArea: "right", background: "yellow", overflow: "auto" }}>
//           <form>
//             <RecipeComponent title="hello" isLoading={isLoading} body={body} schema={schema}/>
//           </form>
//         </div>
//         <div css={{ gridArea: "footer", background: "green", justifyItems: "center", display: "grid", align: "center"}}>
//           <Footer />
//         </div>
//       </div>
//     );
//   }
// }
export default Curation;
// export const CurationComponent = withRouter(Curation);
