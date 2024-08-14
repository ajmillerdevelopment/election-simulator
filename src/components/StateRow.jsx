import react from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tooltip";
import styles from "./stateRow.css";

const StateRow = (props) => {
    const formatter = new Intl.NumberFormat("en-US");
    const state = props.state;
    let reportedVote = ((state.dReporting + state.rReporting) / 100).toFixed(0);
    let totalReported = state.dReporting + state.rReporting;
    let dpercent = ((state.dReporting / totalReported) * 100).toFixed(1);
    let rpercent = ((state.rReporting / totalReported) * 100).toFixed(1);
    let dtotal;
    let rtotal;
    if (state.totalVote) {
        dtotal = (
            state.totalVote *
            (reportedVote * 0.01) *
            (dpercent * 0.01)
        ).toFixed(0);
        rtotal = (
            state.totalVote *
            (reportedVote * 0.01) *
            (rpercent * 0.01)
        ).toFixed(0);
        dtotal = formatter.format(dtotal);
        rtotal = formatter.format(rtotal);
    }
    if (dpercent > rpercent) {
        return (
            <Tooltip id={`${state.code}-tip`}>
                <div className="tooltip">
                    <p>{state.fullName}</p>
                    <p className="dbox">
                        {dtotal} {dpercent}% D {state.called ? "✓" : null}
                    </p>
                    <p className="rbox">
                        {rtotal} {rpercent}% R
                    </p>
                    <p>{reportedVote}% reporting</p>
                </div>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip id={`${state.code}-tip`}>
                <div className="tooltip">
                    <p>{state.fullName}</p>
                    <p className="rbox">
                        {rtotal} {rpercent}% R {state.called ? "✓" : null}
                    </p>
                    <p className="dbox">
                        {dtotal} {dpercent}% D
                    </p>
                    <p>{reportedVote}% reporting</p>
                </div>
            </Tooltip>
        );
    }
};
export default observer(StateRow);
