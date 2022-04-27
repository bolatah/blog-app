import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Application from "./application";
import reportWebVitals from "./reportWebVitals";
import "./assets/styles/dots.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>
);

reportWebVitals();
