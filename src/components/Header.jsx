import React from "react";
import { observer } from "mobx-react-lite";
import SimulationVM from "./../viewmodels/simulation";
import styles from "./header.css";

export default function Header(props) {
    const vm = SimulationVM;
    return (
        <div className="header">
            <h2 className="clock">
                {vm.hour.toString()}
                {vm.ticking ? <span className="blink">:</span> : ":"}
                {vm.minute.toString()}
            </h2>
            <div className="controls">
                <button
                    onClick={() => {
                        vm.ticking = !vm.ticking;
                    }}
                >
                    {vm.ticking ? "Pause" : "Play"}
                </button>
            </div>

            {/* <h4>{vm.timeCode}</h4> */}
            <div className="results-bar">
                <div
                    id="prezHeader"
                    className="active"
                    onClick={() => {
                        document
                            .getElementById("senateHeader")
                            .classList.remove("active");
                        document
                            .getElementById("houseHeader")
                            .classList.remove("active");
                        document
                            .getElementById("prezHeader")
                            .classList.add("active");
                        props.setModule("presidential");
                    }}
                >
                    <h3>President</h3>
                    <div>
                        <strong style={{ color: "red", margin: "0 5px" }}>
                            Trump: {vm.REVs} {vm.REVs > 269 ? "✓" : null}{" "}
                        </strong>{" "}
                        <strong style={{ color: "blue" }}>
                            Harris: {vm.DEVs} {vm.DEVs > 269 ? "✓" : null}
                        </strong>
                    </div>
                </div>
                <div
                    id="senateHeader"
                    onClick={() => {
                        document
                            .getElementById("senateHeader")
                            .classList.add("active");
                        document
                            .getElementById("houseHeader")
                            .classList.remove("active");
                        document
                            .getElementById("prezHeader")
                            .classList.remove("active");
                        props.setModule("senate");
                    }}
                >
                    <h3>Senate</h3>
                    <div>
                        {" "}
                        <strong style={{ color: "red", margin: "0 5px" }}>
                            GOP: {vm.RSen}{" "}
                            {vm.RSen > 50 || (vm.RSen === 50 && vm.REVs > 269)
                                ? "✓"
                                : null}
                        </strong>{" "}
                        <strong style={{ color: "blue" }}>
                            Dems: {vm.DSen}{" "}
                            {vm.DSen > 50 || (vm.DSen === 50 && vm.DEVs > 269)
                                ? "✓"
                                : null}
                        </strong>
                    </div>
                </div>
                <div
                    id="houseHeader"
                    onClick={() => {
                        document
                            .getElementById("senateHeader")
                            .classList.remove("active");
                        document
                            .getElementById("houseHeader")
                            .classList.add("active");
                        document
                            .getElementById("prezHeader")
                            .classList.remove("active");
                        props.setModule("house");
                    }}
                >
                    <h3>House</h3>
                    <div>
                        <strong style={{ color: "red", margin: "0 5px" }}>
                            GOP: {vm.RHouse}
                            {vm.RHouse > 217 ? "✓" : null}
                        </strong>{" "}
                        <strong style={{ color: "blue" }}>
                            Dems: {vm.DHouse}
                            {vm.DHouse > 217 ? "✓" : null}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
