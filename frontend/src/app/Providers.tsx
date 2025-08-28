import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";

export const Providers = ({ children }: { children: ReactNode }) => {
    return <Provider store={store} >
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
}