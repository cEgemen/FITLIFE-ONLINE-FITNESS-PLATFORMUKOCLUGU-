import React, { useState } from "react";


export default function ToggleState (value) {

    const [toggleValue, toggleChange] = useState(value || false);

    const handleToggleChange = () => {
        toggleChange(!toggleValue);
    }
    function resetToggle(value) {
        toggleChange(value || false);
    }

    return [toggleValue, handleToggleChange, resetToggle];
}