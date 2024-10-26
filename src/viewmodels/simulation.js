/* eslint-disable import/no-anonymous-default-export */
import { makeAutoObservable, action, observable, computed } from "mobx";
import NeedleVM from "./needles";

class SimulationVM {
    constructor() {
        makeAutoObservable(this, {
            tick: action,
            hour: observable,
            minute: observable,
            timeCode: observable,
            rPop: computed,
            dPop: computed,
        });
    }
    instantiate(options, data) {
        const [
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
        ] = options;
        this.stateList = Object.values(data);
        this.stateCodes = Object.keys(data);
        let nationalFactor = 0;
        if (baseError) {
            nationalFactor += this.roll(0, 2);
        }
        nationalFactor += base;
        let neFactor = neSwing;
        if (neError) {
            neFactor += this.roll(0, 0.5);
        }
        let sFactor = sSwing;
        if (sError) {
            sFactor += this.roll(0, 0.5);
        }
        let mwFactor = mwSwing;
        if (mwError) {
            mwFactor += this.roll(0, 0.5);
        }
        let mtFactor = mtSwing;
        if (mtError) {
            mtFactor += this.roll(0, 0.5);
        }
        let swFactor = swSwing;
        if (swError) {
            swFactor += this.roll(0, 0.5);
        }
        let wFactor = wSwing;
        if (wError) {
            wFactor += this.roll(0, 0.5);
        }
        console.log(nationalFactor);
        console.log(`NE: ${neFactor}`);
        console.log(`S: ${sFactor}`);
        console.log(`MW: ${mwFactor}`);
        console.log(`MT: ${mtFactor}`);
        console.log(`SW: ${swFactor}`);
        console.log(`W: ${wFactor}`);
        this.stateList.forEach((state, i) => {
            switch (state.region) {
                case "NE":
                    state.regionalFactor = neFactor;
                    break;
                case "S":
                    state.regionalFactor = sFactor;
                    break;
                case "MW":
                    state.regionalFactor = mwFactor;
                    break;
                case "MT":
                    state.regionalFactor = mtFactor;
                    break;
                case "SW":
                    state.regionalFactor = swFactor;
                    break;
                case "W":
                    state.regionalFactor = wFactor;
                    break;
                default:
                    state.regionalFactor = 0;
            }
            state.totalVote = state.totalVote * 0.85;
            state.dReporting = 0;
            state.dRemaining = Math.round(state.totalVote / 2);
            state.rReporting = 0;
            state.rRemaining = Math.round(state.totalVote / 2);
            state.eDayReporting = 0;
            state.VBMReporting = 100;
            state.exVBMVote = 0;
            let iFactor = Math.random() * (0.02 - 0.01) + 0.01;
            if (state.fullName === "Michigan") iFactor *= 2;
            state.iReporting = 0;
            state.iRemaining = Math.round(state.totalVote * iFactor);
            state.dExRemaining = state.dRemaining;
            state.rExRemaining = state.rRemaining;
            if (state.senateMargin) {
                state.dSenExRemaining = state.dRemaining;
                state.rSenExRemaining = state.rRemaining;
            }
            if (state.govMargin) {
                state.dExGovRemaining = state.dRemaining;
                state.rExGovRemaining = state.rRemaining;
            }
            state.code = this.stateCodes[i];
            state.cooldown = 30;
            if (state.senateMargin) {
                state.dSenReporting = 0;
                state.dSenRemaining = Math.round(state.totalVote / 2);
                state.rSenReporting = 0;
                state.rSenRemaining = Math.round(state.totalVote / 2);
            }
            if (state.govMargin) {
                state.dGovReporting = 0;
                state.dGovRemaining = Math.round(state.totalVote / 2);
                state.rGovReporting = 0;
                state.rGovRemaining = Math.round(state.totalVote / 2);
            }
            state.called = false;
            let stateFactor = 0;
            if (stateError) {
                stateFactor += this.roll(0, 0.5);
            }
            if (state.prezMargin < 5 && state.prezMargin > -5) {
                console.warn(state.fullName);
                console.log(`Base Margin: ${state.prezMargin}`);
                console.log(`National Factor ${nationalFactor.toFixed(2)}`);
                console.log(
                    `Regional Factor ${state.regionalFactor.toFixed(2)}`
                );
                console.log(`State Factor ${stateFactor.toFixed(2)}`);
                console.log(
                    `Total Swing ${(
                        nationalFactor +
                        state.regionalFactor +
                        stateFactor
                    ).toFixed(2)}`
                );
                console.log(
                    `Final Margin ${(
                        nationalFactor +
                        state.regionalFactor +
                        stateFactor +
                        state.prezMargin
                    ).toFixed(2)}`
                );
            }

            if (state.prezMargin < 10 && state.prezMargin > -10) {
                stateFactor += nationalFactor / 1.2; //swing state races should be closer & less sensitive to polling swings
            } else {
                stateFactor += nationalFactor * 1.2;
            }
            let exMargin = state.prezMargin;
            let exSenateMargin;
            let exGovMargin;
            if (state.senateMargin) {
                exSenateMargin = state.senateMargin;
            }
            if (state.govMargin) {
                exGovMargin = state.govMargin;
            }
            state.prezMargin += state.regionalFactor;
            state.prezMargin += stateFactor;
            if (state.senateMargin) {
                state.senateMargin += stateFactor;
                state.senateMargin += state.regionalFactor;
                state.senateMargin +=
                    (state.prezMargin - state.senateMargin) / 6; //skew downballot statewides towards POTUS result
            }
            if (state.govMargin) {
                state.govMargin += stateFactor;
                state.govMargin += state.regionalFactor;
            }
            let voteMargin = state.totalVote * (state.prezMargin / 100);
            let senateVoteMargin = state.totalVote * (state.senateMargin / 100);
            let govVoteMargin = state.totalVote * (state.govMargin / 100);
            let exVoteMargin = state.totalVote * (exMargin / 100);
            let exSenateVoteMargin = state.totalVote * (exSenateMargin / 100);
            let exGovVoteMargin = state.totalVote * (exGovMargin / 100);
            state.dRemaining = Math.round(state.dRemaining + voteMargin / 2);
            state.rRemaining = Math.round(state.rRemaining - voteMargin / 2);
            state.dExRemaining = Math.round(
                state.dExRemaining + exVoteMargin / 2
            );
            state.rExRemaining = Math.round(
                state.rExRemaining - exVoteMargin / 2
            );
            if (state.senateMargin) {
                state.dSenRemaining += senateVoteMargin / 2;
                state.rSenRemaining -= senateVoteMargin / 2;
                state.dSenExRemaining += exSenateVoteMargin / 2;
                state.rSenExRemaining -= exSenateVoteMargin / 2;
            }
            if (state.govMargin) {
                state.dGovRemaining += govVoteMargin / 2;
                state.rGovRemaining -= govVoteMargin / 2;
                state.dExGovRemaining += exGovVoteMargin / 2;
                state.rExGovRemaining -= exGovVoteMargin / 2;
            }
            if (state.VBMPercent) {
                state.VBMReporting = 0;
                state.dVBMRemaining = state.dRemaining * state.VBMPercent;
                state.rVBMRemaining = state.rRemaining * state.VBMPercent;
                if (state.senateMargin) {
                    state.dSenVBMRemaining =
                        state.dSenRemaining * state.VBMPercent;
                    state.rSenVBMRemaining =
                        state.rSenRemaining * state.VBMPercent;
                }
                if (state.govMargin) {
                    state.dGovVBMRemaining =
                        state.dGovRemaining * state.VBMPercent;
                    state.rGovVBMRemaining =
                        state.rGovRemaining * state.VBMPercent;
                }

                let VBMMargin =
                    state.totalVote * state.VBMPercent * (state.VBMSplit / 100);
                state.dVBMRemaining = Math.round(
                    state.dVBMRemaining + VBMMargin / 2
                );
                state.rVBMRemaining = Math.round(
                    state.rVBMRemaining - VBMMargin / 2
                );
                state.dRemaining -= state.dVBMRemaining;
                state.rRemaining -= state.rVBMRemaining;
                if (state.senateMargin) {
                    state.dSenVBMRemaining = Math.round(
                        state.dSenVBMRemaining + VBMMargin / 2
                    );
                    state.rSenVBMRemaining = Math.round(
                        state.rSenVBMRemaining - VBMMargin / 2
                    );
                }
                if (state.govMargin) {
                    state.dGovVBMRemaining = Math.round(
                        state.dGovVBMRemaining + VBMMargin / 2
                    );
                    state.rGovVBMRemaining = Math.round(
                        state.rGovVBMRemaining - VBMMargin / 2
                    );
                    state.dGovRemaining -= state.dGovVBMRemaining;
                    state.rGovRemaining -= state.rGovVBMRemaining;
                }
            }
            //House Districts Init
            state.houseSeats?.contested?.forEach((district) => {
                district.state = state;
                district.countSpeed = state.countSpeed;
                district.cooldown = 30;
                let districtFactor = 0;
                if (distError) {
                    districtFactor += this.roll(0, 2);
                }
                district.districtMargin += districtFactor;
                district.districtMargin += stateFactor;
                district.districtMargin += state.regionalFactor;
                district.districtMargin += 1; //TEMP
                let houseMargin = Math.round(
                    200000 * (district.districtMargin / 100)
                );
                district.dReporting = 0;
                district.dRemaining = 100000;
                district.rReporting = 0;
                district.rRemaining = 100000;
                district.dVBMRemaining = 0;
                district.rVBMRemaining = 0;
                district.dRemaining += houseMargin / 2;
                district.rRemaining -= houseMargin / 2;
                if (state.VBMPercent) {
                    district.dVBMRemaining =
                        district.dRemaining * state.VBMPercent;
                    district.rVBMRemaining =
                        district.rRemaining * state.VBMPercent;
                    let VBMMargin =
                        200000 * state.VBMPercent * (state.VBMSplit / 100);
                    district.dVBMRemaining = Math.round(
                        district.dVBMRemaining + VBMMargin / 2
                    );
                    district.rVBMRemaining = Math.round(
                        district.rVBMRemaining - VBMMargin / 2
                    );
                    district.dRemaining -= district.dVBMRemaining;
                    district.rRemaining -= district.rVBMRemaining;
                }
            });
            state.percentile = NeedleVM.calculatePrezPercentile(state);
            state.percentile *= 3;
            if (state.senateMargin) {
                state.senPercentile = NeedleVM.calculateSenatePercentile(state);
                state.senPercentile *= 3;
            }
            if (state.govMargin) {
                state.govPercentile = NeedleVM.calculateGovPercentile(state);
                state.govPercentile *= 3;
            }
        });
        this.hour = "18";
        this.minute = "59";
        setInterval(() => {
            // if (this.ticking) {
            //     this.tick();
            // }
            if (
                this.ticking &&
                this.speedCode === "fast" &&
                this.speedCounter === 1
            ) {
                this.speedCounter = 0;
                this.tick();
            }
            if (
                this.ticking &&
                this.speedCode === "normal" &&
                this.speedCounter === 10
            ) {
                this.speedCounter = 0;
                this.tick();
            }
            if (
                this.ticking &&
                this.speedCode === "slow" &&
                this.speedCounter === 50
            ) {
                this.speedCounter = 0;
                this.tick();
            }
            this.speedCounter++;
        }, 50);
    }
    ticking = true;
    hour;
    minute;
    timeCode;
    stateList = [];
    activeStates = [];
    activeDistricts = [];
    log = [];
    REVs = 0;
    DEVs = 0;
    RSen = 39; // Missing NE race
    DSen = 28;
    RSenGain = 0;
    DSenGain = 0;
    RHouse = 0;
    DHouse = 0;
    RHouseGain = 0;
    DHouseGain = 0;
    RGovs = 19;
    RGovGain = 0;
    DGovs = 20;
    DGovGain = 0;
    called = false;
    senateCalled = false;
    houseCalled = false;
    speedCounter = 0;
    speedCode = "normal";

    get rPop() {
        let sum = 0;
        this.activeStates.forEach((state) => (sum += state.rReporting));
        return sum;
    }
    get dPop() {
        let sum = 0;
        this.activeStates.forEach((state) => (sum += state.dReporting));
        return sum;
    }
    get iPop() {
        let sum = 0;
        this.activeStates.forEach((state) => (sum += state.iReporting));
        return sum;
    }
    changeSpeed(speed) {
        this.speedCode = speed;
        this.speedCounter = 0;
    }
    tick() {
        let minutevalue = Number(this.minute);
        minutevalue++;
        if (minutevalue >= 60) {
            let hourValue = Number(this.hour);
            hourValue++;
            if (hourValue >= 24) {
                hourValue = 0;
            }
            this.hour = hourValue.toString();
            this.minute = "00";
        } else if (minutevalue < 10) {
            this.minute = `0${minutevalue}`;
        } else {
            this.minute = minutevalue.toString();
        }
        this.timeCode = this.hour + this.minute;
        let timeCodeforEval = Number(this.timeCode);
        this.stateList.forEach((state) => {
            if (state.closeTime === timeCodeforEval && !state.called) {
                if (state.fullName === "North Carolina") {
                    //Accounting for Safe R Pickups in NC
                    this.RHouseGain += 3;
                    this.DHouseGain -= 3;
                }
                if (state.fullName === "Georgia") {
                    //McBath's seat
                    this.RHouseGain++;
                    this.DHouseGain--;
                }
                this.activeStates.push(state);
                state.active = true;
                if (state.houseSeats) {
                    if (state.houseSeats.safeD)
                        this.DHouse += state.houseSeats.safeD;
                    if (state.houseSeats.safeR)
                        this.RHouse += state.houseSeats.safeR;
                    if (state.houseSeats.contested)
                        this.activeDistricts = this.activeDistricts.concat(
                            state.houseSeats.contested
                        );
                }
                this.checkForCalls(state);
            }
        });
        this.log.push(``); //necessary for the clock to refresh properly
        this.activeDistricts.forEach((district) => {
            this.reportDistrictVote(district);
            if (district.cooldown > 0) district.cooldown--;
        });
        this.activeStates.forEach((state) => {
            this.reportVote(state);
            if (state.cooldown > 0) state.cooldown--;
        });
    }
    reportVote(state) {
        if (Math.random() < state.countSpeed / 1.8) {
            let rFactor = Math.random() * (0.1 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.1 - 0.01) + 0.01;
            let iFactor = Math.random() * (0.1 - 0.01) + 0.01;
            rFactor -= state.cooldown / 200;
            dFactor -= state.cooldown / 200;
            iFactor -= state.cooldown / 200;
            if (rFactor < 0) rFactor = 0.001;
            if (dFactor < 0) dFactor = 0.001;
            if (iFactor < 0) iFactor = 0.001;
            if (rFactor > 0 && dFactor <= 0) dFactor = 0.001;
            if (dFactor > 0 && rFactor <= 0) rFactor = 0.001;
            rFactor = rFactor * 1.1; //account for rural vote counting faster
            dFactor = dFactor * 0.9; //account for urban vote counting slower
            let rTranche = Math.ceil(state.rRemaining * rFactor);
            let dTranche = Math.ceil(state.dRemaining * dFactor);
            let iTranche = Math.ceil(state.iRemaining * iFactor);
            state.rRemaining = state.rRemaining - rTranche;
            state.rReporting = state.rReporting + rTranche;
            state.dRemaining = state.dRemaining - dTranche;
            state.dReporting = state.dReporting + dTranche;
            state.iRemaining = state.iRemaining - iTranche;
            state.iReporting = state.iReporting += iTranche;
            // if (state.dExRemaining > 0) state.dExRemaining -= dTranche;
            // if (state.rExRemaining > 0) state.rExRemaining -= rTranche;
            //Count mail votes
            if (state.VBMPercent) {
                if (state.VBMDelay === 0) {
                    if (state.VBMInitialReport) {
                        let rVBMFactor = Math.random() * (0.8 - 0.6) + 0.6;
                        let dVBMFactor = Math.random() * (0.8 - 0.6) + 0.6;
                        let rVBMTranche = Math.ceil(
                            state.rVBMRemaining * rVBMFactor
                        );
                        let dVBMTranche = Math.ceil(
                            state.dVBMRemaining * dVBMFactor
                        );
                        state.rVBMRemaining -= rVBMTranche;
                        state.dVBMRemaining -= dVBMTranche;
                        state.dReporting += dVBMTranche;
                        state.rReporting += rVBMTranche;
                        // if (state.dExRemaining > 0)
                        //     state.dExRemaining -= dVBMTranche;
                        // if (state.rExRemaining > 0)
                        //     state.rExRemaining -= rVBMTranche;
                        if (state.senateMargin) {
                            let rSenVBMTranche = Math.ceil(
                                state.rSenVBMRemaining * rVBMFactor
                            );
                            let dSenVBMTranche = Math.ceil(
                                state.dSenVBMRemaining * dVBMFactor
                            );
                            state.rSenVBMRemaining -= rSenVBMTranche;
                            state.dSenVBMRemaining -= dSenVBMTranche;
                            state.dSenReporting += dSenVBMTranche;
                            state.rSenReporting += rSenVBMTranche;
                            //     if (state.dSenExRemaining > 0)
                            //         state.dSenExRemaining -= dSenVBMTranche;
                            //     if (state.rSenExRemaining > 0)
                            //         state.rSenExRemaining -= rSenVBMTranche;
                            //
                        }
                        if (state.govMargin) {
                            let rGovVBMTranche = Math.ceil(
                                state.rGovVBMRemaining * rVBMFactor
                            );
                            let dGovVBMTranche = Math.ceil(
                                state.dGovVBMRemaining * dVBMFactor
                            );
                            state.rGovVBMRemaining -= rGovVBMTranche;
                            state.dGovVBMRemaining -= dGovVBMTranche;
                            state.dGovReporting += dGovVBMTranche;
                            state.rGovReporting += rGovVBMTranche;
                            // if (state.dExGovRemaining > 0)
                            //     state.dExGovRemaining -= dGovVBMTranche;
                            // if (state.rExGovRemaining > 0)
                            //     state.rExGovRemaining -= rGovVBMTranche;
                        }
                        state.VBMInitialReport = false;
                    } else {
                        let rVBMFactor = Math.random() * (0.04 - 0.01) + 0.01;
                        let dVBMFactor = Math.random() * (0.04 - 0.01) + 0.01;
                        let rVBMTranche = Math.ceil(
                            state.rVBMRemaining * rVBMFactor
                        );
                        let dVBMTranche = Math.ceil(
                            state.dVBMRemaining * dVBMFactor
                        );
                        state.rVBMRemaining -= rVBMTranche;
                        state.dVBMRemaining -= dVBMTranche;
                        // if (state.dExRemaining > 0)
                        //     state.dExRemaining -= dVBMTranche;
                        // if (state.rExRemaining > 0)
                        //     state.rExRemaining -= rVBMTranche;
                        state.dReporting += dVBMTranche;
                        state.rReporting += rVBMTranche;
                        if (state.senateMargin) {
                            let rSenVBMTranche = Math.ceil(
                                state.rSenVBMRemaining * rVBMFactor
                            );
                            let dSenVBMTranche = Math.ceil(
                                state.dSenVBMRemaining * dVBMFactor
                            );
                            state.rSenVBMRemaining -= rSenVBMTranche;
                            state.dSenVBMRemaining -= dSenVBMTranche;
                            state.dSenReporting += dSenVBMTranche;
                            state.rSenReporting += rSenVBMTranche;
                            // if (state.dSenExRemaining > 0)
                            //     state.dSenExRemaining -= dSenVBMTranche;
                            // if (state.rSenExRemaining > 0)
                            //     state.rSenExRemaining -= rSenVBMTranche;
                        }
                        if (state.govMargin) {
                            let rGovVBMTranche = Math.ceil(
                                state.rGovVBMRemaining * rVBMFactor
                            );
                            let dGovVBMTranche = Math.ceil(
                                state.dGovVBMRemaining * dVBMFactor
                            );
                            state.rGovVBMRemaining -= rGovVBMTranche;
                            state.dGovVBMRemaining -= dGovVBMTranche;
                            state.dGovReporting += dGovVBMTranche;
                            state.rGovReporting += rGovVBMTranche;
                            // if (state.dExGovRemaining > 0)
                            //     state.dExGovRemaining -= dGovVBMTranche;
                            // if (state.rExGovRemaining > 0)
                            //     state.rExGovRemaining -= rGovVBMTranche;
                        }
                    }
                }
            }
            if (state.senateMargin) {
                let rSenateTranche = Math.ceil(state.rSenRemaining * rFactor);
                let dSenateTranche = Math.ceil(state.dSenRemaining * dFactor);
                state.rSenRemaining = state.rSenRemaining - rSenateTranche;
                state.rSenReporting = state.rSenReporting + rSenateTranche;
                state.dSenRemaining = state.dSenRemaining - dSenateTranche;
                state.dSenReporting = state.dSenReporting + dSenateTranche;
                // if (state.dSenExRemaining > 0)
                //     state.dSenExRemaining -= dTranche;
                // if (state.rSenExRemaining > 0)
                //     state.rSenExRemaining -= rTranche;
            }
            if (state.govMargin) {
                let rGovTranche = Math.ceil(state.rGovRemaining * rFactor);
                let dGovTranche = Math.ceil(state.dGovRemaining * dFactor);
                state.rGovRemaining = state.rGovRemaining - rGovTranche;
                state.rGovReporting = state.rGovReporting + rGovTranche;
                state.dGovRemaining = state.dGovRemaining - dGovTranche;
                state.dGovReporting = state.dGovReporting + dGovTranche;
                // if (state.dExGovRemaining > 0)
                //     state.dExGovRemaining -= dTranche;
                // if (state.rExGovRemaining > 0)
                //     state.rExGovRemaining -= rTranche;
            }
            // if (state.dExRemaining < 0) state.dExRemaining = 0;
            // if (state.rExRemaining < 0) state.rExRemaining = 0;
            // if (state.dSenExRemaining < 0) state.dSenExRemaining = 0;
            // if (state.rSenExRemaining < 0) state.rSenExRemaining = 0;
            // if (state.dExGovRemaining < 0) state.dExGovRemaining = 0;
            // if (state.rExGovRemaining < 0) state.rExGovRemaining = 0;

            this.checkForCalls(state);
        }
        if (this.minute === "59" && state.VBMDelay > 0) {
            state.VBMDelay--;
        }
    }
    reportDistrictVote(district) {
        if (Math.random() < district.countSpeed) {
            let rFactor = Math.random() * (0.07 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.07 - 0.01) + 0.01;
            rFactor -= district.cooldown / 200;
            dFactor -= district.cooldown / 200;
            if (rFactor < 0) rFactor = 0.001;
            if (dFactor < 0) dFactor = 0.001;
            if (rFactor > 0 && dFactor <= 0) dFactor = 0.001;
            if (dFactor > 0 && rFactor <= 0) rFactor = 0.001;
            let rTranche = Math.ceil(district.rRemaining * rFactor);
            let dTranche = Math.ceil(district.dRemaining * dFactor);
            district.rRemaining = district.rRemaining - rTranche;
            district.rReporting = district.rReporting + rTranche;
            district.dRemaining = district.dRemaining - dTranche;
            district.dReporting = district.dReporting + dTranche;
            if (district.state.VBMPercent) {
                if (district.state.VBMDelay === 0) {
                    if (district.state.VBMInitialReport) {
                        let rVBMFactor = Math.random() * (0.8 - 0.6) + 0.6;
                        let dVBMFactor = Math.random() * (0.8 - 0.6) + 0.6;
                        let rVBMTranche = Math.ceil(
                            district.rVBMRemaining * rVBMFactor
                        );
                        let dVBMTranche = Math.ceil(
                            district.dVBMRemaining * dVBMFactor
                        );
                        district.rVBMRemaining -= rVBMTranche;
                        district.dVBMRemaining -= dVBMTranche;
                        district.dReporting += dVBMTranche;
                        district.rReporting += rVBMTranche;
                    } else {
                        let rVBMFactor = Math.random() * (0.04 - 0.01) + 0.01;
                        let dVBMFactor = Math.random() * (0.04 - 0.01) + 0.01;
                        let rVBMTranche = Math.ceil(
                            district.rVBMRemaining * rVBMFactor
                        );
                        let dVBMTranche = Math.ceil(
                            district.dVBMRemaining * dVBMFactor
                        );
                        district.rVBMRemaining -= rVBMTranche;
                        district.dVBMRemaining -= dVBMTranche;
                        district.dReporting += dVBMTranche;
                        district.rReporting += rVBMTranche;
                    }
                }
            }

            district.percentile = NeedleVM.calculateDistPercentile(district);
            if (!district.called && district.districtName !== "AK-AL") {
                if (district.percentile > 200 && district.districtMargin > 0) {
                    if (district.districtMargin < 0)
                        console.warn(`Wrong Call ${district.districtName}`);
                    district.called = "D";
                    this.DHouse++;
                    if (!this.houseCalled && this.DHouse >= 218) {
                        this.log.push(
                            `${this.hour}:${this.minute} - Democrats flip the House!`
                        );
                        this.houseCalled = true;
                    }
                    if (district.last === "R") {
                        this.DHouseGain++;
                        this.RHouseGain--;
                        this.log.push(
                            `${this.hour}:${this.minute} - Democrats flip ${district.districtName} ${district.incumbent}!`
                        );
                    } else if (
                        district.rating === "Tossup" ||
                        district.rating === "Lean D" ||
                        district.rating === "Lean R"
                    ) {
                        this.log.push(
                            `${this.hour}:${this.minute} - Democrats hold ${district.districtName} ${district.incumbent}`
                        );
                    }
                }
                if (district.percentile < -200 && district.districtMargin < 0) {
                    if (district.districtMargin > 0)
                        console.warn(`Wrong Call ${district.districtName}`);
                    district.called = "R";
                    this.RHouse++;
                    if (!this.houseCalled && this.RHouse >= 218) {
                        this.log.push(
                            `${this.hour}:${this.minute} - Republicans hold the House!`
                        );
                        this.houseCalled = true;
                    }
                    if (district.last === "D") {
                        this.RHouseGain++;
                        this.DHouseGain--;
                        this.log.push(
                            `${this.hour}:${this.minute} - Republicans flip ${district.districtName} ${district.incumbent}!`
                        );
                    } else if (
                        district.rating === "Tossup" ||
                        district.rating === "Lean D" ||
                        district.rating === "Lean R"
                    ) {
                        this.log.push(
                            `${this.hour}:${this.minute} - Republicans hold ${district.districtName} ${district.incumbent}`
                        );
                    }
                }
            }
        }
    }
    checkForCalls(state) {
        state.percentile = NeedleVM.calculatePrezPercentile(state);
        if (!state.called) {
            if (
                (state.percentile > 175 &&
                    state.prezMargin > 0 &&
                    (state.dReporting > state.rReporting ||
                        state.prezMargin > 10)) ||
                (state.rRemaining +
                    state.dRemaining +
                    state.rVBMRemaining +
                    state.dVBMRemaining <
                    state.totalVote * 0.001 &&
                    state.dReporting > state.rReporting)
            ) {
                this.callBlue(state);
            }
            if (
                (state.percentile < -175 &&
                    state.prezMargin < 0 &&
                    (state.rReporting > state.dReporting ||
                        state.prezMargin < -10)) ||
                (state.rRemaining +
                    state.dRemaining +
                    state.rVBMRemaining +
                    state.dVBMRemaining <
                    state.totalVote * 0.001 &&
                    state.dReporting < state.rReporting)
            ) {
                this.callRed(state);
            }
        }
        if (state.senateMargin) {
            state.senPercentile = NeedleVM.calculateSenatePercentile(state);
            if (!state.senateCalled) {
                if (
                    (state.senPercentile > 175 &&
                        state.senateMargin > 0 &&
                        (state.dSenReporting > state.rSenReporting ||
                            state.senateMargin > 10)) ||
                    (state.rSenRemaining +
                        state.rSenVBMRemaining +
                        state.dRemaining +
                        state.dSenVBMRemaining <
                        state.totalVote * 0.001 &&
                        state.dSenReporting > state.rSenReporting)
                ) {
                    this.callBlueSen(state);
                }
                if (
                    (state.senPercentile < -175 &&
                        state.senateMargin < 0 &&
                        (state.rSenReporting > state.dSenReporting ||
                            state.senateMargin < -10)) ||
                    (state.rSenRemaining +
                        state.rSenVBMRemaining +
                        state.dRemaining +
                        state.dSenVBMRemaining <
                        state.totalVote * 0.001 &&
                        state.dSenReporting < state.rSenReporting)
                ) {
                    this.callRedSen(state);
                }
            }
        }
        if (state.govMargin) {
            state.govPercentile = NeedleVM.calculateGovPercentile(state);
            if (!state.govCalled) {
                if (
                    (state.govPercentile > 175 &&
                        state.govMargin > 0 &&
                        (state.dGovReporting > state.rGovReporting ||
                            state.govMargin > 10)) ||
                    (state.rGovRemaining +
                        state.rGovVBMRemaining +
                        state.dGovRemaining +
                        state.dGovVBMRemaining <
                        state.totalVote * 0.001 &&
                        state.dGovReporting > state.rGovReporting)
                ) {
                    this.callBlueGov(state);
                }
                if (
                    (state.govPercentile < -175 &&
                        state.govMargin < 0 &&
                        (state.rGovReporting > state.dGovReporting ||
                            state.govMargin < -10)) ||
                    (state.rGovRemaining +
                        state.rGovVBMRemaining +
                        state.dGovRemaining +
                        state.dGovVBMRemaining <
                        state.totalVote * 0.001 &&
                        state.dGovReporting < state.rGovReporting)
                ) {
                    this.callRedGov(state);
                }
            }
        }
    }
    callBlue(state) {
        if (!state.called) {
            if (state.prezMargin < 0)
                console.warn(`Wrong Call ${state.fullName} President`);
            this.DEVs += state.evs;
            if (state.lastPrez === "R") {
                this.log.push(
                    `${this.hour}:${this.minute} - Kamala Harris flips ${state.fullName}!`
                );
            } else {
                this.log.push(
                    `${this.hour}:${this.minute} - Kamala Harris wins ${state.fullName}`
                );
            }
            if (!this.called && this.DEVs + state.evs >= 270) {
                this.called = true;
                this.log.push(
                    `${this.hour}:${this.minute} - Kamala Harris elected President!`
                );
            }
            state.called = "D";
        }
    }
    callRed(state) {
        if (!state.called) {
            if (state.prezMargin > 0)
                console.warn(`Wrong Call ${state.fullName} President`);
            this.REVs += state.evs;
            if (state.lastPrez === "D") {
                this.log.push(
                    `${this.hour}:${this.minute} - Donald Trump flips ${state.fullName}!`
                );
            } else {
                this.log.push(
                    `${this.hour}:${this.minute} - Donald Trump wins ${state.fullName}`
                );
            }
            if (!this.called && this.REVs + state.evs >= 270) {
                this.called = true;
                this.log.push(
                    `${this.hour}:${this.minute} - Donald Trump re-elected President!`
                );
            }
            state.called = "R";
        }
    }
    callBlueSen(state) {
        if (!state.senateCalled) {
            if (state.senateMargin < 0)
                console.warn(`Wrong Call ${state.fullName} Senate`);
            state.senateCalled = "D";
            this.DSen++;
            if (
                !this.senateCalled &&
                (this.DSen > 50 || (this.DSen === 5 && this.DEVs >= 270))
            ) {
                this.log.push(
                    `${this.hour}:${this.minute} - Democrats hold the Senate!`
                );
                this.senateCalled = true;
            }
            if (state.lastSen === "R") {
                this.DSenGain++;
                this.RSenGain--;
            }
            if (
                state.senateInc &&
                (state.senateInc === "D" || state.senateInc === "I")
            ) {
                this.log.push(
                    `${this.hour}:${this.minute} - ${state.DSenateName} (${state.fullName}) re-elected to the Senate`
                );
            } else {
                this.log.push(
                    `${this.hour}:${this.minute} - ${state.DSenateName} (${state.fullName}) elected to the Senate`
                );
            }
        }
    }
    callRedSen(state) {
        if (!state.senateCalled) {
            if (state.senateMargin > 0)
                console.warn(`Wrong Call ${state.fullName} Senate`);
            state.senateCalled = "R";
            this.RSen++;
            if (
                !this.senateCalled &&
                (this.RSen > 50 || (this.RSen === 5 && this.REVs >= 270))
            ) {
                this.log.push(
                    `${this.hour}:${this.minute} - Republicans flip the Senate!`
                );
                this.senateCalled = true;
            }
            if (state.lastSen === "D") {
                this.DSenGain--;
                this.RSenGain++;
            }
            if (state.senateInc && state.senateInc === "R") {
                this.log.push(
                    `${this.hour}:${this.minute} - ${state.RSenateName} (${state.fullName}) re-elected to the Senate`
                );
            } else {
                this.log.push(
                    `${this.hour}:${this.minute} - ${state.RSenateName} (${state.fullName}) elected to the Senate`
                );
            }
        }
    }
    callBlueGov(state) {
        if (!state.govCalled) {
            if (state.govMargin < 0)
                console.warn(`Wrong Call ${state.fullName} Gov`);
            state.govCalled = "D";
            this.DGovs++;
            if (state.lastGov === "R") {
                this.DGovGain++;
                this.RGovGain--;
            }
            this.log.push(
                `${this.hour}:${this.minute} - ${state.DGovName} elected Governor of ${state.fullName} `
            );
        }
    }
    callRedGov(state) {
        if (!state.govCalled) {
            if (state.govMargin > 0)
                console.warn(`Wrong Call ${state.fullName} Gov`);
            state.govCalled = "R";
            this.RGovs++;
            if (state.lastGov === "D") {
                this.RGovGain++;
                this.DGovGain--;
            }
            this.log.push(
                `${this.hour}:${this.minute} - ${state.RGovName} elected Governor of ${state.fullName} `
            );
        }
    }
    roll(mean = 0, stdev = 1) {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    }
}

export default new SimulationVM();
