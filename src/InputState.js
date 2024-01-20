import { useState } from "react";

export default function InputState(initialValue) {
    const [inputValue, setInputValueState] = useState(initialValue);
    const handelState = (e,data)=> {
       if(data !== undefined)
       {
        setInputValueState(data)
       }
       else if(e.target === undefined)
        {
            setInputValueState("")
        }
        else
        {setInputValueState(e.target.value);}
    }
    const resetValue = val => {
        setInputValueState( val || "");
    }

    return [inputValue, handelState, resetValue];
}