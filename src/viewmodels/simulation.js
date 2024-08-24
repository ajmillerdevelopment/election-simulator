/* eslint-disable import/no-anonymous-default-export */
import { makeAutoObservable, action, observable, computed } from "mobx";
import stateValues from "../data/states.json";

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
    instantiate(baseSwing) {
        this.stateList = Object.values(stateValues);
        this.stateCodes = Object.keys(stateValues);
        let nationalFactor = Math.random() * (2 - -2) + -2;
        nationalFactor += baseSwing;
        let neFactor = Math.random() * (2 - -2) + -2;
        let sFactor = Math.random() * (2 - -2) + -2;
        let mwFactor = Math.random() * (2 - -2) + -2;
        let mtFactor = Math.random() * (2 - -2) + -2;
        let swFactor = Math.random() * (2 - -2) + -2;
        let wFactor = Math.random() * (2 - -2) + -2;
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
            state.totalVote = state.totalVote * 0.8;
            state.dReporting = 0;
            state.dRemaining = Math.round(state.totalVote / 2);
            state.rReporting = 0;
            state.rRemaining = Math.round(state.totalVote / 2);
            state.code = this.stateCodes[i];
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
            let stateFactor = Math.random() * (2.2 - -2.2) + -2.2;
            if (
                state.prezMargin < 10 ||
                state.senateMargin < 10 ||
                state.govMargin < 10
            ) {
                stateFactor += nationalFactor / 2;
            } else stateFactor += nationalFactor;
            state.prezMargin += stateFactor;
            state.prezMargin += state.regionalFactor;
            if (state.senateMargin) {
                state.senateMargin += stateFactor;
                state.senateMargin += state.regionalFactor;
            }
            if (state.govMargin) {
                state.govMargin += stateFactor;
                state.govMargin += state.regionalFactor;
            }
            let voteMargin = Math.round(
                state.totalVote * (state.prezMargin / 100)
            );
            let senateVoteMargin = Math.round(
                state.totalVote * (state.senateMargin / 100)
            );
            let govVoteMargin = Math.round(
                state.totalVote * (state.govMargin / 100)
            );
            state.dRemaining = state.dRemaining + voteMargin / 2;
            state.rRemaining = state.rRemaining - voteMargin / 2;
            if (state.senateMargin) {
                state.dSenRemaining += senateVoteMargin / 2;
                state.rSenRemaining -= senateVoteMargin / 2;
            }
            if (state.govMargin) {
                state.dGovRemaining += govVoteMargin / 2;
                state.rGovRemaining -= govVoteMargin / 2;
            }
            //House Districts Init
            state.houseSeats?.contested?.forEach((district) => {
                district.countSpeed = state.countSpeed;
                let districtFactor = Math.random() * (4.2 - -4.2) + -4.2;
                district.districtMargin += districtFactor;
                district.districtMargin += stateFactor * 2;
                district.districtMargin += state.regionalFactor;
                district.districtMargin += 1;
                let houseMargin = Math.round(
                    200000 * (district.districtMargin / 100)
                );
                district.dReporting = 0;
                district.dRemaining = 100000;
                district.rReporting = 0;
                district.rRemaining = 100000;
                district.dRemaining += houseMargin / 2;
                district.rRemaining -= houseMargin / 2;
            });
        });
        this.hour = "18";
        this.minute = "59";
        setInterval(() => {
            if (this.ticking) {
                this.tick();
            }
        }, 100);
    }
    ticking = false;
    hour;
    minute;
    timeCode;
    stateList = [];
    activeStates = [];
    activeDistricts = [];
    log = [];
    REVs = 0;
    DEVs = 0;
    RSen = 39;
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
            }
        });
        this.log.push(``); //necessary for the clock to refresh properly
        this.activeStates.forEach((state) => this.reportVote(state));
        this.activeDistricts.forEach((district) =>
            this.reportDistrictVote(district)
        );
        if (this.REVs > 269 && !this.called) {
            this.log.push(`Trump wins presidency!`);
            this.called = true;
        } else if (this.REVs > 269 && !this.called) {
            this.log.push(`Harris wins presidency!`);
            this.called = true;
        }
    }
    reportVote(state) {
        if (Math.random() < state.countSpeed) {
            let rFactor = Math.random() * (0.15 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.15 - 0.01) + 0.01;
            let rTranche = Math.ceil(state.rRemaining * rFactor);
            let dTranche = Math.ceil(state.dRemaining * dFactor);
            state.rRemaining = state.rRemaining - rTranche;
            state.rReporting = state.rReporting + rTranche;
            state.dRemaining = state.dRemaining - dTranche;
            state.dReporting = state.dReporting + dTranche;
            if (state.senateMargin) {
                let rSenateTranche = Math.ceil(state.rSenRemaining * rFactor);
                let dSenateTranche = Math.ceil(state.dSenRemaining * dFactor);
                state.rSenRemaining = state.rSenRemaining - rSenateTranche;
                state.rSenReporting = state.rSenReporting + rSenateTranche;
                state.dSenRemaining = state.dSenRemaining - dSenateTranche;
                state.dSenReporting = state.dSenReporting + dSenateTranche;
            }
            if (state.govMargin) {
                let rGovTranche = Math.ceil(state.rGovRemaining * rFactor);
                let dGovTranche = Math.ceil(state.dGovRemaining * dFactor);
                state.rGovRemaining = state.rGovRemaining - rGovTranche;
                state.rGovReporting = state.rGovReporting + rGovTranche;
                state.dGovRemaining = state.dGovRemaining - dGovTranche;
                state.dGovReporting = state.dGovReporting + dGovTranche;
            }
            let reportedVote = (
                ((state.dReporting + state.rReporting) / state.totalVote) *
                100
            ).toFixed(0);
            if (!state.called) {
                if (state.prezMargin > 15 || state.prezMargin < -15) {
                    if (state.prezMargin > 0) {
                        this.callBlue(state);
                    } else {
                        this.callRed(state);
                    }
                }
                if (
                    state.dReporting - state.rReporting >
                        state.rRemaining * 1.1 ||
                    state.rReporting - state.dReporting > state.dRemaining * 1.1
                ) {
                    if (state.prezMargin > 0) {
                        this.callBlue(state);
                    } else {
                        this.callRed(state);
                    }
                }
            }
            if (state.senateMargin && !state.senateCalled) {
                if (state.senateMargin > 15 || state.senateMargin < -15) {
                    if (
                        reportedVote > 10 ||
                        state.senateMargin > 20 ||
                        state.senateMargin < -20
                    ) {
                        if (state.senateMargin > 0) {
                            this.callBlueSen(state);
                        } else {
                            this.callRedSen(state);
                        }
                    }
                }
                if (
                    state.dSenReporting - state.rSenReporting >
                        state.rSenRemaining * 1.1 ||
                    state.rSenReporting - state.dSenReporting >
                        state.dSenRemaining * 1.1
                ) {
                    if (state.senateMargin > 0) {
                        this.callBlueSen(state);
                    } else {
                        this.callRedSen(state);
                    }
                }
            }
            if (state.govMargin && !state.govCalled) {
                if (state.govMargin > 15 || state.govMargin < -15) {
                    if (
                        reportedVote > 10 ||
                        state.govMargin > 20 ||
                        state.govMargin < -20
                    ) {
                        if (state.govMargin > 0) {
                            this.callBlueGov(state);
                        } else {
                            this.callRedGov(state);
                        }
                    }
                }
                if (
                    state.dGovReporting - state.rGovReporting >
                        state.rGovRemaining ||
                    state.rGovReporting - state.dGovReporting >
                        state.dGovRemaining
                ) {
                    if (state.govMargin > 0) {
                        this.callBlueGov(state);
                    } else {
                        this.callRedGov(state);
                    }
                }
            }
        }
    }
    reportDistrictVote(district) {
        if (Math.random() < district.countSpeed) {
            let rFactor = Math.random() * (0.15 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.15 - 0.01) + 0.01;
            let rTranche = Math.ceil(district.rRemaining * rFactor);
            let dTranche = Math.ceil(district.dRemaining * dFactor);
            district.rRemaining = district.rRemaining - rTranche;
            district.rReporting = district.rReporting + rTranche;
            district.dRemaining = district.dRemaining - dTranche;
            district.dReporting = district.dReporting + dTranche;
            if (!district.called) {
                if (
                    district.dReporting - district.rReporting >
                        district.rRemaining ||
                    district.rReporting - district.dReporting >
                        district.dRemaining
                ) {
                    if (district.districtMargin > 0) {
                        district.called = true;
                        this.DHouse++;
                        if (district.last === "R") {
                            this.DHouseGain++;
                            this.RHouseGain--;
                        }
                    } else {
                        district.called = true;
                        this.RHouse++;
                        if (district.last === "D") {
                            this.DHouseGain--;
                            this.RHouseGain++;
                        }
                    }
                }
            }
        }
    }
    callBlue(state) {
        if (!state.called) {
            state.called = true;
            this.DEVs += state.evs;
            if (state.lastPrez === "R") {
                console.log(`Dems flip ${state.fullName}`);
            }
            this.log.push(
                `${this.hour}:${this.minute} - Harris wins ${state.fullName}`
            );
        }
    }
    callRed(state) {
        if (!state.called) {
            state.called = true;
            this.REVs += state.evs;
            if (state.lastPrez === "D") {
                console.log(`Reps flip ${state.fullName}`);
            }
            this.log.push(
                `${this.hour}:${this.minute} - Trump wins ${state.fullName}`
            );
        }
    }
    callBlueSen(state) {
        if (!state.senateCalled) {
            state.senateCalled = true;
            this.DSen++;
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
            state.senateCalled = true;
            this.RSen++;
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
            state.govCalled = true;
            this.DGovs++;
            if (state.lastGov === "R") {
                this.DGovGain++;
                this.RGovGain--;
            }
        }
    }
    callRedGov(state) {
        if (!state.govCalled) {
            state.govCalled = true;
            this.RGovs++;
            if (state.lastGov === "D") {
                this.RGovGain++;
                this.DGovGain--;
            }
        }
    }
}

export default new SimulationVM();
