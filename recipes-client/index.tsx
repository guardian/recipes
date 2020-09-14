/** @jsx jsx */
import { jsx } from "@emotion/core";
import { render } from "react-dom";
import { Component } from "react";
import Recipe from "~components/recipe";
import Curation from "~pages/curation"
import Home from "~pages/home"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import { text, background } from "@guardian/src-foundations/palette";


function Article() {
  let articleId: string = useParams();
  console.log(articleId);
  return <Curation articleId={articleId}> </Curation>
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/curation">Curation</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/curation/:articleId">
            <Article />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


render(<App />, document.getElementById("root"));
