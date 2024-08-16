/* eslint-disable import/no-anonymous-default-export */
import { makeAutoObservable, action, observable } from "mobx";
import stateValues from "../data/states.json";

class SimulationVM {
    constructor() {
        makeAutoObservable(this, {
            tick: action,
            hour: observable,
            minute: observable,
            timeCode: observable,
        });
        this.stateList = Object.values(stateValues);
        this.stateCodes = Object.keys(stateValues);
        let nationalFactor = Math.random() * (2 - -2) + -2;
        console.log(nationalFactor);
        this.stateList.forEach((state, i) => {
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
            state.called = false;
            let factor = Math.random() * (2.2 - -2.2) + -2.2;
            let senateFactor = Math.random() * (2.2 - -2.2) + -2.2;
            state.prezMargin += factor;
            state.prezMargin += nationalFactor;
            if (state.senateMargin) {
                state.senateMargin += senateFactor;
                state.senateMargin += nationalFactor;
            }
            let voteMargin = Math.round(
                state.totalVote * (state.prezMargin / 100)
            );
            let senateVoteMargin = Math.round(
                state.totalVote * (state.senateMargin / 100)
            );
            state.dRemaining = state.dRemaining + voteMargin;
            state.rRemaining = state.rRemaining - voteMargin;
            if (state.senateMargin) {
                state.dSenRemaining += senateVoteMargin;
                state.rSenRemaining -= senateVoteMargin;
            }
            //House Districts Init
            state.houseSeats?.contested?.forEach((district) => {
                district.countSpeed = state.countSpeed;
                let districtFactor = Math.random() * (2.2 - -2.2) + -2.2;
                district.districtMargin += nationalFactor;
                district.districtMargin += districtFactor;
                district.districtMargin += factor;
                district.districtMargin += 1.5;
                let voteMargin = Math.round(
                    200000 * (district.districtMargin / 100)
                );
                district.dReporting = 0;
                district.dRemaining = 100000;
                district.rReporting = 0;
                district.rRemaining = 100000;
                district.dRemaining += voteMargin;
                district.rRemaining -= voteMargin;
            });
        });
        this.hour = "18";
        this.minute = "59";
        setInterval(() => {
            if (this.ticking) {
                this.tick();
            }
        }, 10);
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
    RHouse = 0;
    DHouse = 0;
    called = false;
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
            if (state.closeTime === timeCodeforEval) {
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
                    state.dReporting - state.rReporting > state.rRemaining ||
                    state.rReporting - state.dReporting > state.dRemaining
                ) {
                    if (state.prezMargin > 0) {
                        this.callBlue(state);
                    } else {
                        this.callRed(state);
                    }
                }
            }
            if (state.senateMargin && !state.senateCalled) {
                if (state.senateMargin > 10 || state.senateMargin < -10) {
                    if (
                        reportedVote > 10 ||
                        state.senateMargin > 15 ||
                        state.senateMargin < -15
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
                        state.rSenRemaining ||
                    state.rSenReporting - state.dSenReporting >
                        state.dSenRemaining
                ) {
                    if (state.senateMargin > 0) {
                        this.callBlueSen(state);
                    } else {
                        this.callRedSen(state);
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
                    } else {
                        district.called = true;
                        this.RHouse++;
                    }
                }
            }
        }
    }
    callBlue(state) {
        state.called = true;
        this.DEVs += state.evs;
        this.log.push(
            `${this.hour}:${this.minute} - Harris wins ${state.fullName}`
        );
    }
    callRed(state) {
        state.called = true;
        this.REVs += state.evs;
        this.log.push(
            `${this.hour}:${this.minute} - Trump wins ${state.fullName}`
        );
    }
    callBlueSen(state) {
        state.senateCalled = true;
        this.DSen++;
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
    callRedSen(state) {
        state.senateCalled = true;
        this.RSen++;
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

export default new SimulationVM();
