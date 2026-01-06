import React from "react";
import ReactDOM from "react-dom/client";
// import {RouterProvider} from "react-router-dom";
// import {router} from "./router";
import "./index.css";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import {Provider} from "react-redux";
import {setupStore} from "./store";
import {ThemeProvider} from "./admin/context/ThemeContext.tsx";
import {AppWrapper} from "./admin/components/common/PageMeta.tsx";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";

const queryClient = new QueryClient();
const store = setupStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AppWrapper>
                    <GoogleOAuthProvider clientId={"171665714128-003fuh22ebg5q2mlp1hgfgod31rndo6p.apps.googleusercontent.com"}>
                        <Provider store={store}>
                            <QueryClientProvider client={queryClient}>
                                <App/>
                                {/*<RouterProvider router={router}/>*/}
                            </QueryClientProvider>
                        </Provider>
                    </GoogleOAuthProvider>
                </AppWrapper>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);