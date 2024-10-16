import React, { useEffect } from "react";
import SimulationVM from "./../viewmodels/simulation";
import PrezTooltip from "./../components/PrezTooltip";
import Map from "../components/Map";

export default function Presidential() {
    const vm = SimulationVM;
    const toolTips = vm.stateList.map((state) => {
        return <PrezTooltip state={state} />;
    });
    let logElements = vm.log.map((x) => {
        return <p style={{ margin: 1 }}>{x}</p>;
    });
    // eslint-disable-next-line no-unused-vars
    logElements = logElements.reverse();
    useEffect(() => {
        vm.stateList.forEach((state) => {
            const elem = document.getElementsByClassName(`${state.code}`);
            let reportedVote = (
                ((state.dReporting + state.rReporting) / state.totalVote) *
                100
            ).toFixed(0);
            if (state.active) {
                if (state.called) {
                    if (state.prezMargin < 0) {
                        if (state.lastPrez === "D") {
                            elem[0]?.classList.add("called-red-flip");
                        } else {
                            elem[0]?.classList.add("called-red");
                        }
                        elem[0]?.classList.remove("leaning-red");
                        elem[0]?.classList.remove("leaning-blue");
                        elem[0]?.classList.remove("too-early");
                    } else {
                        if (state.lastPrez === "R") {
                            elem[0]?.classList.add("called-blue-flip");
                        } else {
                            elem[0]?.classList.add("called-blue");
                        }
                        elem[0]?.classList.remove("leaning-red");
                        elem[0]?.classList.remove("leaning-blue");
                        elem[0]?.classList.remove("too-early");
                    }
                } else if (
                    state.rReporting > state.dReporting &&
                    reportedVote > 30
                ) {
                    elem[0]?.classList.add("leaning-red");
                    elem[0]?.classList.remove("leaning-blue");
                    elem[0]?.classList.remove("too-early");
                } else if (
                    state.dReporting > state.rReporting &&
                    reportedVote > 30
                ) {
                    elem[0]?.classList.add("leaning-blue");
                    elem[0]?.classList.remove("leaning-red");
                    elem[0]?.classList.remove("too-early");
                } else {
                    elem[0]?.classList.add("too-early");
                    elem[0]?.classList.remove("leaning-red");
                    elem[0]?.classList.remove("leaning-blue");
                }
            }
        });
    }, [vm.stateList, vm.timeCode]);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "start",
                justifyContent: "space-between",
            }}
        >
            <div>{logElements}</div>
            <Map />
            {toolTips}
        </div>
    );
}
