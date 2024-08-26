import React, { useState } from "react";
import SimulationVM from "./../viewmodels/simulation";

export default function Header(props) {
    const vm = SimulationVM;
    const [base, setBase] = useState(0);
    const [baseError, setBaseError] = useState(true);
    const [neSwing, setNESwing] = useState(0);
    const [neError, setNEError] = useState(true);
    const [sSwing, setSSwing] = useState(0);
    const [sError, setSError] = useState(true);
    const [mwSwing, setMwSwing] = useState(0);
    const [mwError, setMidwestError] = useState(true);
    const [mtSwing, setMtSwing] = useState(0);
    const [mtError, setMtError] = useState(true);
    const [swSwing, setSwSwing] = useState(0);
    const [swError, setSwError] = useState(true);
    const [wSwing, setwSwing] = useState(0);
    const [wError, setwError] = useState(true);
    const [stateError, setStateError] = useState(true);
    const [distError, setDistError] = useState(true);
    const options = [
        base,
        baseError,
        neSwing,
        neError,
        sSwing,
        sError,
        mwSwing,
        mwError,
        mtSwing,
        mtError,
        swSwing,
        swError,
        wSwing,
        wError,
        stateError,
        distError,
    ];
    return (
        <div
            className="start"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                with: "100%",
            }}
        >
            <button
                className="startButton"
                onClick={() => {
                    vm.instantiate(options);
                    props.setModule("presidential");
                }}
            >
                Start
            </button>
            <p>
                Set custom national swing (note that the base scenario is
                already D+3)
            </p>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                    type="number"
                    onChange={(e) => {
                        setBase(Number(e.target.value));
                    }}
                />
                <input
                    type="checkbox"
                    checked={baseError}
                    onChange={(e) => {
                        setBaseError(!baseError);
                    }}
                    title="Base Error?"
                />
                <p>Polling error?</p>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: "1000px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>Northeast Swing</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="number"
                            onChange={(e) => {
                                setNESwing(Number(e.target.value));
                            }}
                        />
                        <input
                            type="checkbox"
                            checked={neError}
                            onChange={(e) => {
                                setNEError(!neError);
                            }}
                            title="Base Error?"
                        />
                        <p>Polling error?</p>
                    </div>
                    <p>South Swing</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="number"
                            onChange={(e) => {
                                setSSwing(Number(e.target.value));
                            }}
                        />
                        <input
                            type="checkbox"
                            checked={sError}
                            onChange={(e) => {
                                setSError(!sError);
                            }}
                            title="Base Error?"
                        />
                        <p>Polling error?</p>
                    </div>
                    <p>Midwest Swing</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="number"
                            onChange={(e) => {
                                setMwSwing(Number(e.target.value));
                            }}
                        />
                        <input
                            type="checkbox"
                            checked={mwError}
                            onChange={(e) => {
                                setMidwestError(!mwError);
                            }}
                            title="Base Error?"
                        />
                        <p>Polling error?</p>
                    </div>
                    <p>Mountain Swing</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="number"
                            onChange={(e) => {
                                setMtSwing(Number(e.target.value));
                            }}
                        />
                        <input
                            type="checkbox"
                            checked={mtError}
                            onChange={(e) => {
                                setMtError(!mtError);
                            }}
                            title="Base Error?"
                        />
                        <p>Polling error?</p>
                    </div>
                    <p>Southwest Swing</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="number"
                            onChange={(e) => {
                                setSwSwing(Number(e.target.value));
                            }}
                        />
                        <input
                            type="checkbox"
                            checked={swError}
                            onChange={(e) => {
                                setSwError(!swError);
                            }}
                            title="Base Error?"
                        />
                        <p>Polling error?</p>
                    </div>
                    <p>West Swing</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="number"
                            onChange={(e) => {
                                setwSwing(Number(e.target.value));
                            }}
                        />
                        <input
                            type="checkbox"
                            checked={wError}
                            onChange={(e) => {
                                setwError(!wError);
                            }}
                            title="Base Error?"
                        />
                        <p>Polling error?</p>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <input
                            type="checkbox"
                            checked={stateError}
                            onChange={(e) => {
                                setStateError(!stateError);
                            }}
                            title="Base Error?"
                        />
                        <p>State Polling error?</p>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={distError}
                            onChange={(e) => {
                                setDistError(!distError);
                            }}
                            title="Base Error?"
                        />
                        <p>District Polling error?</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
