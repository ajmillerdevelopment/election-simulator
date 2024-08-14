import "./App.css";
import React, { useEffect, useRef } from "react";
import StateRow from "./components/StateRow";
import Map from "./components/Map";
import { observer } from "mobx-react-lite";
import SimulationVM from "./viewmodels/simulation";
import { Tooltip } from "react-tooltip";

import President from "./President";

function App() {
    let vm = SimulationVM;
    const rowElements = vm.activeStates.map((state) => {
        return <StateRow state={state} />;
    });
    let logElements = vm.log.map((x) => {
        return <p style={{ margin: 1 }}>{x}</p>;
    });
    logElements = logElements.reverse();

    useEffect(() => {}, [vm.keyStates, vm.logElements, vm.timeCode]);
    return (
        <div className="App">
            <h2>{vm.timeCode}</h2>
            <button
                onClick={() => {
                    vm.ticking = !vm.ticking;
                    console.log(vm.ticking);
                }}
            >
                tick
            </button>
            <button
                onClick={() => {
                    console.log(vm);
                }}
            >
                print
            </button>
            {/* <h4>{vm.timeCode}</h4> */}
            <div style={{ display: "flex", flexDirection: "row" }}>
                <strong style={{ color: "red", margin: "0 5px" }}>
                    Trump: {vm.REVs}{" "}
                </strong>{" "}
                <strong style={{ color: "blue" }}>Harris: {vm.DEVs}</strong>
                <strong style={{ color: "red", margin: "0 5px" }}>
                    GOP: {vm.RSen}{" "}
                </strong>{" "}
                <strong style={{ color: "blue" }}>Dems: {vm.DSen}</strong>
                <strong style={{ color: "red", margin: "0 5px" }}>
                    GOP: {vm.RHouse}{" "}
                </strong>{" "}
                <strong style={{ color: "blue" }}>Dems: {vm.DHouse}</strong>
                <p>{435 - (vm.RHouse + vm.DHouse)}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>{rowElements}</div>
                <Map vm={vm} />
            </div>

            {logElements}
        </div>
    );
}

export default observer(App);
