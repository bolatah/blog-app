import ReactDOM from "react-dom/client";
import Application from "./app";
import "./assets/styles/dots.css";
import "./assets/styles/custom.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<Application />);
