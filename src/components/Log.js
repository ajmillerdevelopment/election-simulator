import React, { useEffect } from "react";
import SimulationVM from "../viewmodels/simulation";

export default function Log() {
    const vm = SimulationVM;
    let logElements = vm.log.map((logElm) => {
        return <p>{logElm}</p>;
    });
    logElements = logElements.reverse();
    useEffect(() => {});
    return <div>{logElements}</div>;
}
