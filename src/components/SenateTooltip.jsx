import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const SenTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    let reportedVote = (
        ((state.dReporting + state.rReporting) / state.totalVote) *
        100
    ).toFixed(0);
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

    return (
        <Tooltip id={`${state.code}-sen-tip`}>
            <div className="tooltip">
                <strong>{state.fullName}</strong>
                <>
                    {state.dSenReporting > state.rSenReporting ? (
                        <>
                            <p>
                                <p>{state.DSenateName}</p>
                                <span>{dSenTotal}</span>
                                <span className="dbox">
                                    {" "}
                                    {dSenatePercent}%{" "}
                                    {state.senateCalled &&
                                    state.senateMargin > 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                            <p>
                                <p>{state.RSenateName}</p>
                                <span>{rSenTotal}</span>
                                <span className="rbox">
                                    {" "}
                                    {rSenatePercent}%{" "}
                                    {state.senateCalled &&
                                    state.senateMargin < 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                <p>{state.RSenateName}</p>
                                <span>{rSenTotal}</span>
                                <span className="rbox">
                                    {" "}
                                    {rSenatePercent}%{" "}
                                    {state.senateCalled &&
                                    state.senateMargin < 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                            <p>
                                <p>{state.DSenateName}</p>
                                <span>{dSenTotal}</span>
                                <span className="dbox">
                                    {" "}
                                    {dSenatePercent}%{" "}
                                    {state.senateCalled &&
                                    state.senateMargin > 0
                                        ? "✓"
                                        : null}
                                </span>
                            </p>
                        </>
                    )}
                </>
                <p>{reportedVote}% reporting</p>
            </div>
        </Tooltip>
    );
};
export default observer(SenTooltip);
