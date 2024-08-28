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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
    let vm = SimulationVM;
    const [module, setModule] = useState("start");
    let logElements = vm.log.map((x) => {
        return <p style={{ margin: 1 }}>{x}</p>;
    });
    // eslint-disable-next-line no-unused-vars
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
            {module === "governors" ? <Governors /> : null}
            {module === "house" ? <House /> : null}
            <ToastContainer position="bottom-right" hideProgressBar />
        </div>
    );
}

export default observer(App);
