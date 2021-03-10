/** @jsx jsx */
import { jsx } from "@emotion/core";
import { render } from "react-dom";
import Curation from "~pages/curation";
import Home from "~pages/home";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// import { text, background } from "@guardian/src-foundations/palette";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/curation/:articleId*" component={ Curation }/>
          <Route path="/" component={ Home }/>
        </Switch>
      </div>
    </Router>
  );
}


render(<App />, document.getElementById("root"));
