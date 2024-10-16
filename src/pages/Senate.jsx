import React, { useEffect } from "react";
import SimulationVM from "./../viewmodels/simulation";
import SenMap from "../components/SenMap";
import SenateTooltip from "../components/SenateTooltip";

function Senate() {
    const vm = SimulationVM;
    const toolTips = vm.stateList.map((state) => {
        if (state.senateMargin) {
            return <SenateTooltip state={state} />;
        } else return null;
    });
    let logElements = vm.log.map((x) => {
        return <p style={{ margin: 1 }}>{x}</p>;
    });
    // eslint-disable-next-line no-unused-vars
    logElements = logElements.reverse();
    useEffect(() => {
        vm.stateList.forEach((state) => {
            const elem = document.getElementsByClassName(`sen-${state.code}`);
            if (!state.senateMargin) {
                elem[0]?.classList.add("no-race");
            } else {
                let reportedVote = (
                    ((state.dReporting + state.rReporting) / state.totalVote) *
                    100
                ).toFixed(0);
                if (state.active) {
                    if (state.senateCalled) {
                        if (state.senateMargin < 0) {
                            if (state.lastSen === "D") {
                                elem[0]?.classList.add("called-red-flip");
                            } else {
                                elem[0]?.classList.add("called-red");
                            }
                            elem[0]?.classList.remove("leaning-red");
                            elem[0]?.classList.remove("leaning-blue");
                            elem[0]?.classList.remove("too-early");
                        } else {
                            if (state.lastSen === "D") {
                                elem[0]?.classList.add("called-blue");
                            } else {
                                elem[0]?.classList.add("called-blue-flip");
                            }
                            elem[0]?.classList.remove("leaning-red");
                            elem[0]?.classList.remove("leaning-blue");
                            elem[0]?.classList.remove("too-early");
                        }
                    } else if (
                        state.rSenReporting > state.dSenReporting &&
                        reportedVote > 30
                    ) {
                        elem[0]?.classList.add("leaning-red");
                        elem[0]?.classList.remove("leaning-blue");
                        elem[0]?.classList.remove("too-early");
                    } else if (
                        state.dSenReporting > state.rSenReporting &&
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
            <SenMap />
            {toolTips}
        </div>
    );
}
export default Senate;
