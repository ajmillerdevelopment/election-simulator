import React, { useEffect } from "react";
import SimulationVM from "./../viewmodels/simulation";
import GovMap from "../components/GovMap";
import GovTooltip from "../components/GovTooltip";

function Senate() {
    const vm = SimulationVM;
    const toolTips = vm.stateList.map((state) => {
        if (state.govMargin) {
            return <GovTooltip state={state} />;
        } else return null;
    });
    let logElements = vm.log.map((x) => {
        return <p style={{ margin: 1 }}>{x}</p>;
    });
    // eslint-disable-next-line no-unused-vars
    logElements = logElements.reverse();
    useEffect(() => {
        vm.stateList.forEach((state) => {
            const elem = document.getElementsByClassName(`gov-${state.code}`);
            if (!state.govMargin) {
                elem[0]?.classList.add("no-race");
            } else {
                let reportedVote = (
                    ((state.dGovReporting + state.rGovReporting) /
                        state.totalVote) *
                    100
                ).toFixed(0);
                if (state.active) {
                    if (state.govCalled) {
                        if (state.govCalled === "R") {
                            if (state.lastGov === "D") {
                                elem[0]?.classList.add("called-red-flip");
                            } else {
                                elem[0]?.classList.add("called-red");
                            }
                            elem[0]?.classList.remove("leaning-red");
                            elem[0]?.classList.remove("leaning-blue");
                            elem[0]?.classList.remove("too-early");
                        } else {
                            if (state.lastGov === "D") {
                                elem[0]?.classList.add("called-blue");
                            } else {
                                elem[0]?.classList.add("called-blue-flip");
                            }
                            elem[0]?.classList.remove("leaning-red");
                            elem[0]?.classList.remove("leaning-blue");
                            elem[0]?.classList.remove("too-early");
                        }
                    } else if (
                        state.rGovReporting > state.dGovReporting &&
                        reportedVote > 30
                    ) {
                        elem[0]?.classList.add("leaning-red");
                        elem[0]?.classList.remove("leaning-blue");
                        elem[0]?.classList.remove("too-early");
                    } else if (
                        state.dGovReporting > state.rGovReporting &&
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vm.timeCode]);
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

            <GovMap />
            {toolTips}
        </div>
    );
}
export default Senate;
