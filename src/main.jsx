import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AuthModalProvider from "./context/AuthModalContext";

// FIX: eruda (a mobile debug console) was being initialized twice —
// once here and again in App.jsx — and unconditionally, so every real
// user in production got a floating debug-console button. It's now
// dev-only and loaded once.
if (import.meta.env.DEV) {
  import("eruda").then(({ default: eruda }) => eruda.init());
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AuthModalProvider>
      <App />
    </AuthModalProvider>
  </AuthProvider>,
);
