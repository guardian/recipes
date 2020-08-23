/** @jsx jsx */
import { jsx } from "@emotion/core";
import { render } from "react-dom";

import { greeting } from "~consts";

const App = () => (
  <div
    css={{
      color: "blue",
      fontSize: 100,
    }}
  >
    {greeting}
  </div>
);

render(<App />, document.getElementById("root"));
