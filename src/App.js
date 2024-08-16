import "./App.css";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import SimulationVM from "./viewmodels/simulation";
import Header from "./components/Header";
import Start from "./pages/Start";
import Presidential from "./pages/Presidential";
import Senate from "./pages/Senate";

function App() {
    let vm = SimulationVM;
    const [module, setModule] = useState("start");
    let logElements = vm.log.map((x) => {
        return <p style={{ margin: 1 }}>{x}</p>;
    });
    logElements = logElements.reverse();

    useEffect(() => {}, [vm.timeCode]);
    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {module !== "start" ? <Header setModule={setModule} /> : null}
            {module === "start" ? <Start setModule={setModule} /> : null}
            {module === "presidential" ? <Presidential /> : null}
            {module === "senate" ? <Senate /> : null}
            {logElements}
        </div>
    );
}

export default observer(App);
