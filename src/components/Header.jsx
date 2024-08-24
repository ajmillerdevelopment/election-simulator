import React from "react";
import { observer } from "mobx-react-lite";
import SimulationVM from "./../viewmodels/simulation";
import styles from "./header.css";

export default function Header(props) {
    const formatter = new Intl.NumberFormat("en-US");
    const vm = SimulationVM;
    let rVotes = formatter.format(vm.rPop);
    let dVotes = formatter.format(vm.dPop);
    let totalVote = vm.rPop + vm.dPop;
    let rPercent = ((vm.rPop / totalVote) * 100).toFixed(1);
    let dPercent = ((vm.dPop / totalVote) * 100).toFixed(1);
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
                        document
                            .getElementById("govHeader")
                            .classList.remove("active");
                        props.setModule("presidential");
                    }}
                >
                    <h3>President</h3>
                    <div>
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            {" "}
                            <strong style={{ color: "red", margin: "0 5px" }}>
                                Trump: {vm.REVs} {vm.REVs > 269 ? "✓" : null}{" "}
                            </strong>{" "}
                            <span>
                                {rVotes} {rPercent}%
                            </span>
                            <span>{vm.REst}</span>
                        </div>
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <strong style={{ color: "blue" }}>
                                Harris: {vm.DEVs} {vm.DEVs > 269 ? "✓" : null}
                            </strong>
                            <span>
                                {dVotes} {dPercent}%
                            </span>
                            <span>{vm.DEst}</span>
                        </div>
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
                        document
                            .getElementById("govHeader")
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
                            {vm.RSenGain > -1 ? "+" : null}
                            {vm.RSenGain}
                        </strong>{" "}
                        <strong style={{ color: "blue" }}>
                            Dems: {vm.DSen}{" "}
                            {vm.DSen > 50 || (vm.DSen === 50 && vm.DEVs > 269)
                                ? "✓"
                                : null}
                            {vm.DSenGain > -1 ? "+" : null}
                            {vm.DSenGain}
                        </strong>
                    </div>
                </div>
                <div
                    id="govHeader"
                    onClick={() => {
                        document
                            .getElementById("senateHeader")
                            .classList.remove("active");
                        document
                            .getElementById("houseHeader")
                            .classList.remove("active");
                        document
                            .getElementById("prezHeader")
                            .classList.remove("active");
                        document
                            .getElementById("govHeader")
                            .classList.add("active");
                        props.setModule("governors");
                    }}
                >
                    <h3>Governors</h3>
                    <div>
                        <strong style={{ color: "red", margin: "0 5px" }}>
                            GOP: {vm.RGovs}
                            {vm.RGovGain > -1 ? "+" : null}
                            {vm.RGovGain}
                        </strong>{" "}
                        <strong style={{ color: "blue" }}>
                            Dems: {vm.DGovs}
                            {vm.DGovGain > -1 ? "+" : null}
                            {vm.DGovGain}
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
                        document
                            .getElementById("govHeader")
                            .classList.remove("active");
                        props.setModule("house");
                    }}
                >
                    <h3>House</h3>
                    <div>
                        <strong style={{ color: "red", margin: "0 5px" }}>
                            GOP: {vm.RHouse}
                            {vm.RHouse > 217 ? "✓" : null}
                            {vm.RHouseGain > -1 ? "+" : null}
                            {vm.RHouseGain}
                        </strong>{" "}
                        <strong style={{ color: "blue" }}>
                            Dems: {vm.DHouse}
                            {vm.DHouse > 217 ? "✓" : null}
                            {vm.DHouseGain > -1 ? "+" : null}
                            {vm.DHouseGain}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
