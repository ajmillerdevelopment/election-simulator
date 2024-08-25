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
    if (percentile < 30 && percentile > -30) {
        needle = "Tossup";
    }
    if (percentile >= 30 && percentile < 60) {
        needle = "Lean D";
    }
    if (percentile >= 60 && percentile < 90) {
        needle = "Likely D";
    }
    if (percentile >= 90) {
        needle = "Safe D";
    }
    if (percentile <= -30 && percentile > -60) {
        needle = "Lean R";
    }
    if (percentile <= -60 && percentile > -90) {
        needle = "Likely R";
    }
    if (percentile <= -90) {
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
                        <>
                            <p>
                                <p>{state.DGovName}</p>
                                <span>{dGovTotal}</span>
                                <span className="dbox">
                                    {" "}
                                    {dGovPercent}%{" "}
                                    {state.govCalled && state.govMargin > 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                            <p>
                                <p>{state.RGovName}</p>
                                <span>{rGovTotal}</span>
                                <span className="rbox">
                                    {" "}
                                    {rGovPercent}%{" "}
                                    {state.govCalled && state.govMargin < 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                <p>{state.RGovName}</p>
                                <span>{rGovTotal}</span>
                                <span className="rbox">
                                    {" "}
                                    {rGovPercent}%{" "}
                                    {state.govCalled && state.govMargin < 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                            <p>
                                <p>{state.DGovName}</p>
                                <span>{dGovTotal}</span>
                                <span className="dbox">
                                    {" "}
                                    {dGovPercent}%{" "}
                                    {state.govCalled && state.govMargin > 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                        </>
                    )}
                </>
                <p>{reportedVote}% reporting</p>
                <p>
                    {needle} {displayPercentile}
                </p>
            </div>
        </Tooltip>
    );
};
export default observer(GovTooltip);
