import React from "react";
import { observer } from "mobx-react-lite";
import SimulationVM from "./../viewmodels/simulation";

export default function Header(props) {
    const vm = SimulationVM;
    const keyStates = vm.stateList.filter((x) => {
        return x.prezMargin < 10 || x.prezMargin > -10;
    });
    return (
        <div
            className="start"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <button
                className="startButton"
                onClick={() => {
                    vm.instantiate(2);
                    props.setModule("presidential");
                }}
            >
                Start
            </button>
        </div>
    );
}
