import react from "react";
import { observer } from "mobx-react-lite";

const StateRow = (props) => {
    const state = props.state;
    let reportedVote = ((state.dReporting + state.rReporting) / 100).toFixed(0);
    let totalReported = state.dReporting + state.rReporting;
    let dpercent = ((state.dReporting / totalReported) * 100).toFixed(1);
    let rpercent = ((state.rReporting / totalReported) * 100).toFixed(1);
    if (dpercent > rpercent) {
        return (
            <div className="state-row">
                <p style={{ color: "blue" }}>{state.fullName}</p>
                <p style={{ color: "blue" }}>{state.evs.toString()}</p>
                <p style={{ color: "blue" }}>{dpercent.toString()}% D</p>
                <p style={{ color: "red" }}>{rpercent.toString()}% R</p>
                <strong style={{ color: "blue" }}>
                    D+{(dpercent - rpercent).toFixed(1)}
                </strong>
                <p>{reportedVote}% Reporting</p>
                {state.called ? (
                    <strong style={{ color: "blue" }}>Called</strong>
                ) : null}
            </div>
        );
    } else {
        return (
            <div className="state-row">
                <p style={{ color: "red" }}>{state.fullName}</p>
                <p style={{ color: "red" }}>{state.evs.toString()}</p>
                <p style={{ color: "red" }}>{rpercent.toString()}% R</p>
                <p style={{ color: "blue" }}>{dpercent.toString()}% D</p>
                <strong style={{ color: "red" }}>
                    R+{(rpercent - dpercent).toFixed(1)}
                </strong>
                <p>{reportedVote}% Reporting</p>
                {state.called ? (
                    <strong style={{ color: "red" }}>Called</strong>
                ) : null}
            </div>
        );
    }
};
export default observer(StateRow);
