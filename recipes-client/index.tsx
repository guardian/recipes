/** @jsx jsx */
import { jsx } from "@emotion/core";
import { render } from "react-dom";
import Curation from "~pages/curation";
import Home from "~pages/home";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/curation/:section/*" element={<Curation />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

render(<App />, document.getElementById("root"));
