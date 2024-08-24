/* eslint-disable no-unused-vars */
import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const PrezTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    const percentile = state.percentile;
    let reportedVote = (
        ((state.dReporting + state.rReporting) / state.totalVote) *
        100
    ).toFixed(0);
    let totalReported = state.dReporting + state.rReporting;
    let dpercent = ((state.dReporting / totalReported) * 100).toFixed(1);
    let rpercent = ((state.rReporting / totalReported) * 100).toFixed(1);
    let dtotal;
    let rtotal;

    dtotal = state.dReporting;
    rtotal = state.rReporting;
    dtotal = formatter.format(dtotal);
    rtotal = formatter.format(rtotal);

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
    // 100 > 100
    // 0 > 50
    // if (percentile > 0) {
    //     displayPercentile = `${percentile + (percentile - 50)}% D`;
    // }
    // if (percentile < 0) {
    //     displayPercentile = `${percentile * 1 + (percentile + 50)}% R`;
    // }
    return (
        <Tooltip id={`${state.code}-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong>{" "}
                <span style={{ color: "black" }}>{state.evs}</span>
                {state.active ? (
                    <>
                        {" "}
                        {state.dReporting > state.rReporting ? (
                            <>
                                <p>
                                    <p>Harris</p>
                                    <span> {dtotal} </span>

                                    <span className="dbox">
                                        {dpercent}%{" "}
                                        {state.called && state.prezMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </p>
                                <p>
                                    <p>Trump</p>
                                    <span>{rtotal}</span>
                                    <span className="rbox">
                                        {" "}
                                        {rpercent}%{" "}
                                        {state.called && state.prezMargin < 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <>
                                {" "}
                                <p>
                                    <p>Trump</p>
                                    <span>{rtotal}</span>
                                    <span className="rbox">
                                        {" "}
                                        {rpercent}%{" "}
                                        {state.called && state.prezMargin < 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </p>
                                <p>
                                    <p>Harris</p>
                                    <span> {dtotal} </span>

                                    <span className="dbox">
                                        {dpercent}%{" "}
                                        {state.called && state.prezMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </p>
                            </>
                        )}
                        <p>{reportedVote}% reporting</p>
                    </>
                ) : null}
                <p>
                    {needle} {displayPercentile}
                </p>
            </div>
        </Tooltip>
    );
};
export default observer(PrezTooltip);
