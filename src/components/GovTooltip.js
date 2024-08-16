import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./tooltip.css";

const GovTooltip = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    let reportedVote = (
        ((state.dReporting + state.rReporting) / state.totalVote) *
        100
    ).toFixed(0);
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
            </div>
        </Tooltip>
    );
};
export default observer(GovTooltip);
