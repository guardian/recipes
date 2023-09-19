/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createRoot } from "react-dom/client";
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

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
