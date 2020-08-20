import React from "react";
import ReactDOM from "react-dom";
import { Voyager } from "graphql-voyager";

function introspectionProvider(query) {
  return fetch("http://localhost:4000", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query }),
  }).then((response) => response.json());
}

ReactDOM.render(
  // <h1>Welcome to react!!</h1>,
  <Voyager introspection={introspectionProvider} workerURI={process.env.PUBLIC_URL + '/voyager.worker.js'}Î/>,
  document.getElementById("voyager")
);
