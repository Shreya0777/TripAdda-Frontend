import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"
import eruda from "eruda";
import AuthModalProvider from "./context/AuthModalContext";

eruda.init();

ReactDOM.createRoot(document.getElementById("root")).render(
 <AuthProvider>

    <AuthModalProvider>

        <App />

    </AuthModalProvider>

</AuthProvider>
);