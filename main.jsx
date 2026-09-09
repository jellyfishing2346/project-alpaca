import React, {useState, useMemo, useEffect} from "react";
import { createRoot } from "react-dom/client";
import App from "./alpacees-directory-final.jsx";
import { loadAlpacees } from "./sheet.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
