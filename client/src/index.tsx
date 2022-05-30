import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Application from "./app";
import reportWebVitals from "./reportWebVitals";
import "./assets/styles/dots.css";
import "./assets/styles/custom.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>
);

reportWebVitals();
