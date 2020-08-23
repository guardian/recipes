/** @jsx jsx */
import { jsx } from "@emotion/core";
import { render } from "react-dom";
import { text, background } from "@guardian/src-foundations/palette";

import { greeting } from "~consts";

const App = () => (
  <div
    css={{
      color: text.ctaPrimary,
      background: background.ctaPrimary,
      fontSize: 200,
    }}
  >
    {greeting}
  </div>
);

render(<App />, document.getElementById("root"));
