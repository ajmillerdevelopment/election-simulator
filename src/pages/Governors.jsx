import React, { useEffect } from "react";
import SimulationVM from "./../viewmodels/simulation";
import GovMap from "../components/GovMap";
import GovTooltip from "../components/GovTooltip";
import Log from "../components/Log";

function Senate() {
    const vm = SimulationVM;
    const toolTips = vm.stateList.map((state) => {
        if (state.govMargin) {
            return <GovTooltip state={state} />;
        } else return null;
    });

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
                        if (state.govMargin < 0) {
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
            {/* <Log /> */}
            <GovMap />
            {toolTips}
        </div>
    );
}
export default Senate;
