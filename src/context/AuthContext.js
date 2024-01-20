import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const initialValue = { user: JSON.parse(localStorage.getItem("currentUser")) || null };

export const CurrentUserContext = createContext(initialValue);


export function CurrentUserContextProvider(props) {

    const [state, dispatch] = useReducer(AuthReducer, initialValue);
     
    useEffect(() => {
        localStorage.setItem("currentUser", JSON.stringify(state.user))
    },[state.user]);
     console.log("authContent is started");
    return <CurrentUserContext.Provider
        value={{state,dispatch}}
    >
        {props.children}
    </CurrentUserContext.Provider>
}