/* eslint-disable import/no-anonymous-default-export */
import { makeAutoObservable, action } from "mobx";
import stateValues from "../data/states.json";

class SimulationVM {
    constructor() {
        makeAutoObservable(this, {
            tick: action,
        });
        this.stateList = Object.values(stateValues);
        this.stateCodes = Object.keys(stateValues);
        let nationalFactor = Math.random() * (2 - -2) + -2;
        console.log(nationalFactor);
        this.stateList.forEach((state, i) => {
            state.totalVote = state.totalVote * 0.8;
            state.dReporting = 0;
            state.dRemaining = 5000;
            state.rReporting = 0;
            state.rRemaining = 5000;
            if (state.senateMargin) {
                state.dSenReporting = 0;
                state.dSenRemaining = 5000;
                state.rSenReporting = 0;
                state.rSenRemaining = 5000;
            }
            state.called = false;
            state.code = this.stateCodes[i];
            let factor = Math.random() * (2.2 - -2.2) + -2.2;
            state.prezMargin += factor;
            state.prezMargin += nationalFactor;
            if (state.senateMargin) {
                state.senateMargin += factor;
                state.senateMargin += nationalFactor;
            }
            state = this.calculateHouse(state, factor + nationalFactor);
            if (state.prezMargin < 0) {
                state.dRemaining =
                    state.dRemaining -
                    Math.round((state.prezMargin * -100) / 2);
                state.rRemaining =
                    state.rRemaining +
                    Math.round((state.prezMargin * -100) / 2);
            } else {
                state.dRemaining =
                    state.dRemaining + Math.round((state.prezMargin * 100) / 2);
                state.rRemaining =
                    state.rRemaining - Math.round((state.prezMargin * 100) / 2);
            }

            if (state.senateMargin && state.senateMargin < 0) {
                state.dSenRemaining =
                    state.dSenRemaining -
                    Math.round((state.senateMargin * -100) / 2);
                state.rSenRemaining =
                    state.rSenRemaining +
                    Math.round((state.senateMargin * -100) / 2);
            }
            if (state.senateMargin && state.senateMargin > 0) {
                state.dSenRemaining =
                    state.dSenRemaining +
                    Math.round((state.senateMargin * 100) / 2);
                state.rSenRemaining =
                    state.rSenRemaining -
                    Math.round((state.senateMargin * 100) / 2);
            }
        });
        this.hour = "06";
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
                const elem = document.getElementsByClassName(state.code);
                if (elem) {
                    elem[0].classList.add("too-early");
                }
            }
        });
        this.activeStates.forEach((state) => this.reportVote(state));
        if (this.REVs > 269 && !this.called) {
            this.log.push(
                `${this.hour}:${this.minute} - Trump wins presidency!`
            );
            this.called = true;
        } else if (this.REVs > 269 && !this.called) {
            this.log.push(
                `${this.hour}:${this.minute} - Harris wins presidency!`
            );
            this.called = true;
        }
    }
    reportVote(state) {
        if (Math.random() < state.countSpeed) {
            let rFactor = Math.random() * (0.1 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.1 - 0.01) + 0.01;
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
            this.countHouse(state);
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
            if (!state.called && state.rReporting + state.dReporting > 3000) {
                if (state.rReporting > state.dReporting) {
                    const elem = document.getElementsByClassName(state.code);
                    if (elem) {
                        elem[0].classList.remove("too-early", "leaning-blue");
                        elem[0].classList.add("leaning-red");
                    }
                } else {
                    const elem = document.getElementsByClassName(state.code);
                    if (elem) {
                        elem[0].classList.remove("too-early", "leaning-red");
                        elem[0].classList.add("leaning-blue");
                    }
                }
            }
            if (state.senateMargin && !state.senateCalled) {
                if (state.senateMargin > 10 || state.senateMargin < -10) {
                    if (
                        state.dSenReporting + state.rSenReporting > 1000 ||
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
                        state.rSenRemaining * 0.9 ||
                    state.rSenReporting - state.dSenReporting >
                        state.dSenRemaining * 0.9
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
    callBlue(state) {
        console.log(`calling ${state.fullName}`);
        state.called = true;
        this.DEVs += state.evs;
        const elem = document.getElementsByClassName(state.code);
        if (elem) {
            elem[0].classList.remove(
                "too-early",
                "leaning-blue",
                "leaning-red"
            );
            elem[0].classList.add("called-blue");
        }
        this.log.push(
            `${this.hour}:${this.minute} - Harris wins ${state.fullName}`
        );
    }
    callRed(state) {
        console.log(`calling ${state.fullName}`);
        state.called = true;
        this.REVs += state.evs;
        const elem = document.getElementsByClassName(state.code);
        if (elem) {
            elem[0].classList.remove(
                "too-early",
                "leaning-blue",
                "leaning-red"
            );
            elem[0].classList.add("called-red");
        }
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
    calculateHouse(state, totalMargin) {
        const seats = state.houseSeats;
        if (!seats.safeD) seats.safeD = null;
        if (!seats.likelyD) seats.likelyD = null;
        if (!seats.leanD) seats.leanD = null;
        if (!seats.tossup) seats.tossup = null;
        if (!seats.leanR) seats.leanR = null;
        if (!seats.likelyR) seats.likelyR = null;
        if (!seats.safeR) seats.safeR = null;
        state.d30 = null;
        state.d60 = null;
        state.d90 = null;
        state.d99 = null;
        state.r99 = null;
        state.r90 = null;
        state.r60 = null;
        state.r30 = null;

        if (totalMargin < -3) {
            state.d30 += seats.safeD;
            state.d99 += seats.likelyD;
            state.r99 += seats.leanD;
            state.r90 += seats.tossup;
            state.r60 += seats.leanR;
            state.r30 += seats.likelyR;
            state.r30 += seats.safeR;
        } else if (totalMargin < -1) {
            state.d30 += seats.safeD;
            state.d90 += seats.likelyD;
            state.d99 += seats.leanD;
            state.r99 += seats.tossup;
            state.r90 += seats.leanR;
            state.r60 += seats.likelyR;
            state.r30 += seats.safeR;
        } else if (totalMargin > 1) {
            state.d30 += seats.safeD;
            state.d30 += seats.likelyD;
            state.d60 += seats.leanD;
            state.d90 += seats.tossup;
            state.d99 += seats.leanR;
            state.r99 += seats.likelyR;
            state.r30 += seats.safeR;
        } else if (totalMargin > 3) {
            state.d30 += seats.safeD;
            state.d30 += seats.likelyD;
            state.d30 += seats.leanD;
            state.d60 += seats.tossup;
            state.d90 += seats.leanR;
            state.d99 += seats.likelyR;
            state.r30 += seats.safeR;
        } else {
            state.d30 += seats.safeD;
            state.d60 += seats.likelyD;
            state.d90 += seats.leanD;
            state.d99 += seats.tossup;
            state.r99 += seats.leanR;
            state.r90 += seats.likelyR;
            state.r30 += seats.safeR;
        }
        delete state.houseSeats;
        return state;
    }
    countHouse(state) {
        if (state.rReporting + state.dReporting > 3000) {
            this.DHouse += state.d30;
            this.RHouse += state.r30;
            state.d30 = 0;
            state.r30 = 0;
        }
        if (state.rReporting + state.dReporting > 6000) {
            this.DHouse += state.d60;
            this.RHouse += state.r60;
            state.d60 = 0;
            state.r60 = 0;
        }
        if (state.rReporting + state.dReporting > 9000) {
            this.DHouse += state.d90;
            this.RHouse += state.r90;
            state.d90 = 0;
            state.r90 = 0;
        }
        if (state.rReporting + state.dReporting > 9900) {
            this.DHouse += state.d99;
            this.RHouse += state.r99;
            state.d99 = 0;
            state.r99 = 0;
        }
    }
}

export default new SimulationVM();
