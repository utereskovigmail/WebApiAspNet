import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import {GoogleOAuthProvider} from '@react-oauth/google';
const queryClient = new QueryClient();
const CLIENT = "878719651158-1eqdn1m31aupb34qp43qdu58gsk883dg.apps.googleusercontent.com";
ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider clientId={CLIENT}>
                    <RouterProvider router={router} />
                </GoogleOAuthProvider>

            </QueryClientProvider>
        </React.StrictMode>


);
