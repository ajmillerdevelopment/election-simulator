import React from "react";
import { observer } from "mobx-react-lite";

export default observer(function Tooltip(props) {
    const vm = props.vm;
    const state = vm.stateList.find((x) => x.code === props.state.code);
    return (
        <Tooltip anchorSelect=".ga" place="top">
            {state.fullName}
        </Tooltip>
    );
});
