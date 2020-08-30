/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment } from "react";
import { render } from "react-dom";

import GuFrame from "~components/gu-frame";
import { articlePath } from "~consts";

const App = () => (
  <Fragment>
    <div css={{ width: "50%", height: "100vh" }}>
      <GuFrame articlePath={articlePath} />
    </div>
  </Fragment>
);

render(<App />, document.getElementById("root"));
