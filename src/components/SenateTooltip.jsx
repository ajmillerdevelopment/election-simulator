/* eslint-disable no-unused-vars */
import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const SenTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    const percentile = state.senPercentile;
    let reportedVote =
        ((state.dReporting + state.rReporting) / state.totalVote) * 100;
    reportedVote = Math.floor(reportedVote).toFixed(0);
    let dSenatePercent;
    let rSenatePercent;
    let totalSenateReported;
    if (state.senateMargin) {
        totalSenateReported = state.dSenReporting + state.rSenReporting;
        dSenatePercent = (
            (state.dSenReporting / totalSenateReported) *
            100
        ).toFixed(1);
        rSenatePercent = (
            (state.rSenReporting / totalSenateReported) *
            100
        ).toFixed(1);
    }
    let dSenTotal;
    let rSenTotal;
    if (state.senateMargin) {
        dSenTotal = state.dSenReporting;
        rSenTotal = state.rSenReporting;
        dSenTotal = formatter.format(dSenTotal);
        rSenTotal = formatter.format(rSenTotal);
    }

    let needle = "Tossup";
    if (percentile < 20 && percentile > -20) {
        needle = "Tossup";
    }
    if (percentile >= 20 && percentile < 40) {
        needle = "Lean D";
    }
    if (percentile >= 40 && percentile < 90) {
        needle = "Likely D";
    }
    if (percentile >= 90) {
        needle = "Safe D";
    }
    if (percentile <= -20 && percentile > -40) {
        needle = "Lean R";
    }
    if (percentile <= -40 && percentile > -90) {
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
        <Tooltip id={`${state.code}-sen-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong>{" "}
                <span style={{ color: "black" }}>{state.EVs}</span>
                <>
                    {state.dSenReporting > state.rSenReporting ? (
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
                                <p>{state.DSenateName}</p>
                                <p>{state.RSenateName}</p>
                            </div>
                            <div className="tooltip-col">
                                <span>{dSenTotal}</span>
                                <span>{rSenTotal}</span>
                            </div>
                            <div className="tooltip-col">
                                <span className="dbox">
                                    <span>
                                        {dSenatePercent}%{" "}
                                        {state.called && state.senateMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </span>
                                <span className="rbox">
                                    {" "}
                                    {rSenatePercent}%{" "}
                                    {state.called && state.senateMargin < 0
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
                                <p>{state.RSenateName}</p>
                                <p>{state.DSenateName}</p>
                            </div>
                            <div className="tooltip-col">
                                <span>{rSenTotal}</span>

                                <span>{dSenTotal}</span>
                            </div>
                            <div className="tooltip-col">
                                <span className="rbox">
                                    {" "}
                                    {rSenatePercent}%{" "}
                                    {state.called && state.senateMargin < 0
                                        ? "✓"
                                        : null}
                                </span>
                                <span className="dbox">
                                    <span>
                                        {dSenatePercent}%{" "}
                                        {state.called && state.senateMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                </>
                <p>{reportedVote}% reporting</p>
                {state.senateCalled ? null : <p>{needle}</p>}
            </div>
        </Tooltip>
    );
};
export default observer(SenTooltip);
