import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import "primeicons/primeicons.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LibraryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LibraryProvider>
    </AuthProvider>
  </StrictMode>,
);