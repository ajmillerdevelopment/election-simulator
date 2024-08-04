import "./App.css";
import React, { useEffect, useRef } from "react";
import StateRow from "./components/StateRow";
import { observer } from "mobx-react-lite";
import { SimulationVM } from "./viewmodels/simulation";
import Map from "./components/Map";
import Tooltip from "./components/Tooltip";

function President(props) {
    const vm = props.vm;
    const rowElements = vm.activeStates.map((state) => {
        return <StateRow state={state} />;
    });
    // const tipElements = vm.stateList.map((state) => {
    //     return <Tooltip state={state} vm={vm} />;
    // });

    // useEffect(() => {}, [vm.activeStates]);
    return (
        <div className="App">
            {/* <h1>
                {vm.hour}:{vm.minute}
            </h1> */}
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
            <div style={{ display: "flex", flexDirection: "row" }}>
                <strong style={{ color: "red", margin: "0 5px" }}>
                    Trump: {vm.REVs}{" "}
                </strong>{" "}
                <strong style={{ color: "blue" }}>Harris: {vm.DEVs}</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>{rowElements}</div>
                <Map />
            </div>
            {/* {tipElements} */}
        </div>
    );
}

export default observer(President);
