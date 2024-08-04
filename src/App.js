import "./App.css";
import React, { useEffect, useRef } from "react";

import { observer } from "mobx-react-lite";
import { SimulationVM } from "./viewmodels/simulation";

import President from "./President";

function App() {
    const vm = new SimulationVM();
    // vm = useRef(vm);
    return <President vm={vm} />;
}

export default observer(App);
