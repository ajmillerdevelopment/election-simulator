import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./stateRow.css";

const StateRow = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    let reportedVote = (
        ((state.dReporting + state.rReporting) / state.totalVote) *
        100
    ).toFixed(0);
    let totalReported = state.dReporting + state.rReporting;
    let dpercent = ((state.dReporting / totalReported) * 100).toFixed(1);
    let rpercent = ((state.rReporting / totalReported) * 100).toFixed(1);
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
    let dtotal;
    let rtotal;
    let dSenTotal;
    let rSenTotal;

    dtotal = state.dReporting;
    rtotal = state.rReporting;
    dtotal = formatter.format(dtotal);
    rtotal = formatter.format(rtotal);
    if (state.senateMargin) {
        dSenTotal = state.dSenReporting;
        rSenTotal = state.rSenReporting;
        dSenTotal = formatter.format(dSenTotal);
        rSenTotal = formatter.format(rSenTotal);
    }

    return (
        <Tooltip id={`${state.code}-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong>
                {state.dReporting > state.rReporting ? (
                    <>
                        <p>
                            <strong>Harris</strong>
                            <span> {dtotal} </span>

                            <span className="dbox">
                                {dpercent}%{" "}
                                {state.called && state.prezMargin > 1
                                    ? "✓"
                                    : null}
                            </span>
                        </p>
                        <p>
                            <strong>Trump</strong>
                            <span>{rtotal}</span>
                            <span className="rbox">
                                {" "}
                                {rpercent}%{" "}
                                {state.called && state.prezMargin < 1
                                    ? "✓"
                                    : null}
                            </span>
                        </p>
                    </>
                ) : (
                    <>
                        {" "}
                        <p>
                            <strong>Trump</strong>
                            <span>{rtotal}</span>
                            <span className="rbox">
                                {" "}
                                {rpercent}%{" "}
                                {state.called && state.prezMargin < 1
                                    ? "✓"
                                    : null}
                            </span>
                        </p>
                        <p>
                            <strong>Harris</strong>
                            <span> {dtotal} </span>

                            <span className="dbox">
                                {dpercent}%{" "}
                                {state.called && state.prezMargin > 1
                                    ? "✓"
                                    : null}
                            </span>
                        </p>
                    </>
                )}

                {state.senateMargin ? (
                    <>
                        {state.dSenReporting > state.rSenReporting ? (
                            <>
                                <strong>{state.fullName} Senate</strong>
                                <p className="dbox">
                                    {dSenTotal} {dSenatePercent}%{" "}
                                    {state.DSenateName}-D{" "}
                                    {state.senateCalled &&
                                    state.senateMargin > 1
                                        ? "✓"
                                        : null}
                                </p>
                                <p className="rbox">
                                    {rSenTotal} {rSenatePercent}%{" "}
                                    {state.RSenateName}-R{" "}
                                    {state.senateCalled &&
                                    state.senateMargin < 1
                                        ? "✓"
                                        : null}
                                </p>
                            </>
                        ) : (
                            <>
                                <strong>{state.fullName} Senate</strong>
                                <p className="rbox">
                                    {rSenTotal} {rSenatePercent}%{" "}
                                    {state.RSenateName}-R{" "}
                                    {state.senateCalled &&
                                    state.senateMargin < 1
                                        ? "✓"
                                        : null}
                                </p>
                                <p className="dbox">
                                    {dSenTotal} {dSenatePercent}%{" "}
                                    {state.DSenateName}-D{" "}
                                    {state.senateCalled &&
                                    state.senateMargin > 1
                                        ? "✓"
                                        : null}
                                </p>
                            </>
                        )}
                    </>
                ) : null}
                <p>{reportedVote}% reporting</p>
            </div>
        </Tooltip>
    );
};
export default observer(StateRow);
