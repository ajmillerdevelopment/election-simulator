/* eslint-disable no-unused-vars */
import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const GovTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    const percentile = state.govPercentile;
    let reportedVote =
        ((state.dReporting + state.rReporting) / state.totalVote) * 100;
    reportedVote = Math.floor(reportedVote).toFixed(0);
    let dGovPercent;
    let rGovPercent;
    let totalGovReported;
    if (state.govMargin) {
        totalGovReported = state.dGovReporting + state.rGovReporting;
        dGovPercent = ((state.dGovReporting / totalGovReported) * 100).toFixed(
            1
        );
        rGovPercent = ((state.rGovReporting / totalGovReported) * 100).toFixed(
            1
        );
    }
    let dGovTotal;
    let rGovTotal;
    if (state.govMargin) {
        dGovTotal = state.dGovReporting;
        rGovTotal = state.rGovReporting;
        dGovTotal = formatter.format(dGovTotal);
        rGovTotal = formatter.format(rGovTotal);
    }

    let needle = "Tossup";
    if (percentile < 50 && percentile > -50) {
        needle = "Tossup";
    }
    if (percentile >= 50 && percentile < 100) {
        needle = "Lean D";
    }
    if (percentile >= 100 && percentile < 150) {
        needle = "Likely D";
    }
    if (percentile >= 150) {
        needle = "Safe D";
    }
    if (percentile <= -50 && percentile > -100) {
        needle = "Lean R";
    }
    if (percentile <= -100 && percentile > -150) {
        needle = "Likely R";
    }
    if (percentile <= -150) {
        needle = "Safe R";
    }
    let displayPercentile = percentile;
    displayPercentile = Math.abs(displayPercentile);
    displayPercentile = (
        displayPercentile +
        (100 - displayPercentile) / 2
    ).toFixed(0);
    if (displayPercentile > 100) displayPercentile = 100;
    if (percentile > 0) {
        displayPercentile = `${displayPercentile}% D`;
    } else {
        displayPercentile = `${displayPercentile}% R`;
    }

    return (
        <Tooltip id={`${state.code}-gov-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong>
                <>
                    {state.dGovReporting > state.rGovReporting ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "240px",
                                height: "50px",
                                justifyContent: "center",
                                // border: "1px red solid",
                            }}
                        >
                            <div className="tooltip-col">
                                <p>{state.DGovName}</p>
                                <p>{state.RGovName}</p>
                            </div>
                            <div className="tooltip-col">
                                <span>{dGovTotal}</span>
                                <span>{rGovTotal}</span>
                            </div>
                            <div className="tooltip-col">
                                <span className="dbox">
                                    <span>
                                        {dGovPercent}%{" "}
                                        {state.govCalled && state.govMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </span>
                                <span className="rbox">
                                    {" "}
                                    {rGovPercent}%{" "}
                                    {state.govCalled && state.govMargin < 0
                                        ? "✓"
                                        : null}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "240px",
                                height: "50px",
                                justifyContent: "center",
                                // border: "1px red solid",
                            }}
                        >
                            <div className="tooltip-col">
                                <p>{state.RGovName}</p>
                                <p>{state.DGovName}</p>
                            </div>
                            <div className="tooltip-col">
                                <span>{rGovTotal}</span>

                                <span>{dGovTotal}</span>
                            </div>
                            <div className="tooltip-col">
                                <span className="rbox">
                                    {" "}
                                    {rGovPercent}%{" "}
                                    {state.called && state.called === "R"
                                        ? "✓"
                                        : null}
                                </span>
                                <span className="dbox">
                                    <span>
                                        {dGovPercent}%{" "}
                                        {state.called && state.called === "D"
                                            ? "✓"
                                            : null}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                </>
                <p>{reportedVote}% reporting</p>
                {state.govCalled ? null : <p>{needle}</p>}
            </div>
        </Tooltip>
    );
};
export default observer(GovTooltip);
