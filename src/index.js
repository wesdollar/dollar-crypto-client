import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
// import { Websocket } from "./Websocket";

const isProd = process.env.REACT_APP_ENV === "prod";
let ErrorBoundary;

if (isProd) {
  Bugsnag.start({
    apiKey: "ba990d2b1028f02e671c5f9dd3ad8f38",
    plugins: [new BugsnagPluginReact()],
  });

  ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React);
} else {
  ErrorBoundary = ({ children }) => children;
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
