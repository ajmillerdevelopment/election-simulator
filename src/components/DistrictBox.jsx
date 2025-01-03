import React, { useState } from "react";

export default function DistrictBox(props) {
    const [open, setOpen] = useState(false);
    const dist = props.district;
    const percentile = dist.percentile;
    const formatter = new Intl.NumberFormat("en-US");
    let reportedVote = ((dist.dReporting + dist.rReporting) / 200000) * 100;
    reportedVote = Math.floor(reportedVote).toFixed(0);
    let totalReported = dist.dReporting + dist.rReporting;
    let dpercent = ((dist.dReporting / totalReported) * 100).toFixed(1);
    let rpercent = ((dist.rReporting / totalReported) * 100).toFixed(1);
    let dtotal;
    let rtotal;

    dtotal = dist.dReporting;
    rtotal = dist.rReporting;
    dtotal = formatter.format(dtotal);
    rtotal = formatter.format(rtotal);

    let needle = "Tossup";
    if (percentile < 30 && percentile > -30) {
        needle = "Tossup";
    }
    if (percentile >= 30 && percentile < 60) {
        needle = "Lean D";
    }
    if (percentile >= 60 && percentile < 90) {
        needle = "Likely D";
    }
    if (percentile >= 90) {
        needle = "Safe D";
    }
    if (percentile <= -30 && percentile > -60) {
        needle = "Lean R";
    }
    if (percentile <= -60 && percentile > -90) {
        needle = "Likely R";
    }
    if (percentile <= -90) {
        needle = "Safe R";
    }

    return (
        <div className="district-box">
            <div
                className={`district-header ${dist.districtName}`}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <h4>{dist.districtName}</h4> <span>{dist.incumbent}</span>
            </div>
            {open ? (
                <>
                    {" "}
                    <div className="vote-box">
                        {dist.dReporting > dist.rReporting ? (
                            <>
                                <div>
                                    {dist.DName} {dtotal}{" "}
                                    <span className="dbox">
                                        {dpercent}%{" "}
                                        {dist.called && dist.districtMargin > 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </div>
                                <div>
                                    {dist.RName} {rtotal}{" "}
                                    <span className="rbox">
                                        {rpercent}%{" "}
                                        {dist.called && dist.districtMargin < 0
                                            ? "✓"
                                            : null}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                {" "}
                                <div>
                                    {dist.RName} {rtotal}{" "}
                                    <span className="rbox">
                                        {rpercent}%{" "}
                                        {dist.called && dist.called === "R"
                                            ? "✓"
                                            : null}
                                    </span>
                                </div>
                                <div>
                                    {dist.DName} {dtotal}{" "}
                                    <span className="dbox">
                                        {dpercent}%{" "}
                                        {dist.called && dist.called === "D"
                                            ? "✓"
                                            : null}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                    <p>{reportedVote}% reporting</p>
                    <p>{needle}</p>
                </>
            ) : null}
        </div>
    );
}
