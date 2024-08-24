import React, { useEffect } from "react";
import SimulationVM from "./../viewmodels/simulation";
import DistrictBox from "../components/DistrictBox";
// eslint-disable-next-line no-unused-vars
import styles from "../components/districtbox.css";

export default function House() {
    const vm = SimulationVM;
    const likelyD = [];
    const leanD = [];
    const tossup = [];
    const leanR = [];
    const likelyR = [];
    vm.activeDistricts.forEach((district) => {
        if (district.rating === "Likely D") {
            likelyD.push(<DistrictBox district={district} />);
        }
        if (district.rating === "Lean D") {
            leanD.push(<DistrictBox district={district} />);
        }
        if (district.rating === "Tossup") {
            tossup.push(<DistrictBox district={district} />);
        }
        if (district.rating === "Lean R") {
            leanR.push(<DistrictBox district={district} />);
        }
        if (district.rating === "Likely R") {
            likelyR.push(<DistrictBox district={district} />);
        }
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
                    if (district.last === "D") {
                        elem[0]?.classList.add("called-red-flip-box");
                    } else {
                        elem[0]?.classList.add("called-red-box");
                    }
                    elem[0]?.classList.remove("leaning-red-box");
                    elem[0]?.classList.remove("leaning-blue-box");
                } else {
                    if (district.last === "R") {
                        elem[0]?.classList.add("called-blue-flip-box");
                    } else {
                        elem[0]?.classList.add("called-blue-box");
                    }
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
    }, [vm.activeDistricts, vm.timeCode]);
    return (
        <div className="box-container">
            <div className="likelyD boxcol">
                {" "}
                <h4>Likely D</h4> {likelyD}
            </div>
            <div className="leanD boxcol">
                <h4>Lean D</h4>
                {leanD}
            </div>
            <div className="tossup boxcol">
                <h4>Tossup</h4>
                {tossup}
            </div>
            <div className="leanR boxcol">
                <h4>Lean R</h4>
                {leanR}
            </div>
            <div className="likelyR boxcol">
                <h4>Likely R</h4>
                {likelyR}
            </div>
        </div>
    );
}
