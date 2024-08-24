import React, { useState } from "react";
import SimulationVM from "./../viewmodels/simulation";

export default function Header(props) {
    const vm = SimulationVM;
    const [swing, setSwing] = useState(0);
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
                    vm.instantiate(swing);
                    props.setModule("presidential");
                }}
            >
                Start
            </button>
            <p>
                Custom Swing (Note that the base scenario is already about D+3)
            </p>
            <input
                type="number"
                name="Swing"
                id="swing"
                onChange={(e) => {
                    setSwing(Number(e.target.value));
                }}
            />
        </div>
    );
}
