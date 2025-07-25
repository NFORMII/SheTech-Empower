import './i18n';
import './index.css';
import React from "react";
import ReactDOM from 'react-dom/client';
// import { render } from "react-dom";
import { App } from "./App";
// render(<App />, document.getElementById("root"));
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);