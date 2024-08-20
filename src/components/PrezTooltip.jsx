import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const PrezTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
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

    return (
        <Tooltip id={`${state.code}-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong> {state.evs}
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
            </div>
        </Tooltip>
    );
};
export default observer(PrezTooltip);
