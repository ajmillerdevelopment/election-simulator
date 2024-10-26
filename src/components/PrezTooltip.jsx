/* eslint-disable no-unused-vars */
import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const PrezTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    const percentile = state.percentile;
    let reportedVote =
        ((state.dReporting + state.rReporting + state.iReporting) /
            state.totalVote) *
        100;
    if (reportedVote > 99) reportedVote = 99;
    reportedVote = Math.floor(reportedVote).toFixed(0);
    let totalReported = state.dReporting + state.rReporting + state.iReporting;
    let dpercent = ((state.dReporting / totalReported) * 100).toFixed(1);
    let rpercent = ((state.rReporting / totalReported) * 100).toFixed(1);
    let dtotal;
    let rtotal;

    dtotal = state.dReporting;
    rtotal = state.rReporting;
    dtotal = formatter.format(dtotal);
    rtotal = formatter.format(rtotal);

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
    if (isNaN(rpercent)) rpercent = "0";
    if (isNaN(dpercent)) dpercent = "0";
    return (
        <Tooltip id={`${state.code}-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong>{" "}
                <span style={{ color: "black" }}>{state.evs}</span>
                {state.active ? (
                    <>
                        {" "}
                        {state.dReporting > state.rReporting ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "220px",
                                    height: "50px",
                                    justifyContent: "center",
                                    // border: "1px red solid",
                                }}
                            >
                                <div className="tooltip-col">
                                    <p>Harris</p>
                                    <p>Trump</p>
                                </div>
                                <div className="tooltip-col">
                                    <span>{dtotal}</span>
                                    <span>{rtotal}</span>
                                </div>
                                <div className="tooltip-col">
                                    <span className="dbox">
                                        {dpercent}%{" "}
                                        {state.called && state.prezMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                    <span className="rbox">
                                        {" "}
                                        {rpercent}%{" "}
                                        {state.called && state.prezMargin < 0
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
                                    width: "220px",
                                    height: "50px",
                                    justifyContent: "center",
                                    // border: "1px red solid",
                                }}
                            >
                                <div className="tooltip-col">
                                    <p>Trump</p>
                                    <p>Harris</p>
                                </div>
                                <div className="tooltip-col">
                                    <span>{rtotal}</span>

                                    <span>{dtotal}</span>
                                </div>
                                <div className="tooltip-col">
                                    <span className="rbox">
                                        {" "}
                                        {rpercent}%{" "}
                                        {state.called && state.called === "R"
                                            ? "✓"
                                            : null}
                                    </span>
                                    <span className="dbox">
                                        {dpercent}%{" "}
                                        {state.called && state.called === "D"
                                            ? "✓"
                                            : null}
                                    </span>
                                </div>
                            </div>
                        )}
                        <p>{reportedVote}% reporting</p>
                    </>
                ) : null}
                {state.called ? null : <p>{needle}</p>}
            </div>
        </Tooltip>
    );
};
export default observer(PrezTooltip);
