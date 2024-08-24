import "./App.css";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import SimulationVM from "./viewmodels/simulation";
import Header from "./components/Header";
import Start from "./pages/Start";
import Presidential from "./pages/Presidential";
import Senate from "./pages/Senate";
import House from "./pages/House";
import Governors from "./pages/Governors";

function App() {
    let vm = SimulationVM;
    const [module, setModule] = useState("start");

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
            {module === "governors" ? <Governors /> : null}
            {module === "house" ? <House /> : null}
        </div>
    );
}

export default observer(App);
