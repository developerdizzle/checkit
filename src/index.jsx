import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import { Home } from "./Home";
import { App } from "./App";
import { Edit } from "./Edit";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/:topic/edit" component={Edit} />
      <Route path="/:topic" component={App} />
    </Router>
  ),
  document.getElementById("root")
);
