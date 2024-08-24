import React from "react";
import SimulationVM from "./../viewmodels/simulation";

export default function Header(props) {
    const vm = SimulationVM;
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
                    vm.instantiate(0);
                    props.setModule("presidential");
                }}
            >
                Start
            </button>
        </div>
    );
}
