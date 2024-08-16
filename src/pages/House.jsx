import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import SimulationVM from "./../viewmodels/simulation";
import DistrictBox from "../components/DistrictBox";
import styles from "../components/districtbox.css";

export default function House() {
    const vm = SimulationVM;
    const boxes = vm.activeDistricts.map((district) => {
        return <DistrictBox district={district} />;
    });
    useEffect(() => {
        vm.activeDistricts.forEach((district) => {
            const elem = document.getElementsByClassName(
                `${district.districtName}`
            );
            let reportedVote = (
                ((district.dReporting + district.rReporting) / 200000) *
                100
            ).toFixed(0);
            if (district.called) {
                if (district.districtMargin < 0) {
                    elem[0]?.classList.add("called-red-box");
                    elem[0]?.classList.remove("leaning-red-box");
                    elem[0]?.classList.remove("leaning-blue-box");
                } else {
                    elem[0]?.classList.add("called-blue-box");
                    elem[0]?.classList.remove("leaning-red-box");
                    elem[0]?.classList.remove("leaning-blue-box");
                }
            } else if (reportedVote > 30) {
                if (district.dReporting > district.rReporting) {
                    elem[0]?.classList.add("leaning-blue-box");
                    elem[0]?.classList.remove("leaning-red-box");
                } else {
                    elem[0]?.classList.add("leaning-red-box");
                    elem[0]?.classList.remove("leaning-blue-box");
                }
            }
        });
    }, [vm.timeCode]);
    return <div className="box-container">{boxes}</div>;
}
