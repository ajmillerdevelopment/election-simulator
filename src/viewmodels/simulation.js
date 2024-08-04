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
        this.stateList.forEach((state, i) => {
            state.dReporting = 0;
            state.dRemaining = 5000;
            state.rReporting = 0;
            state.rRemaining = 5000;
            state.called = false;
            state.code = this.stateCodes[i];
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
        });
        this.hour = "06";
        this.minute = "59";
        setInterval(() => {
            if (this.ticking) {
                this.tick();
            }
        }, 500);
    }
    ticking = false;
    hour;
    minute;
    stateList = [];
    activeStates = [];

    REVs = 0;
    DEVs = 0;
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
        let timeCode = this.hour + this.minute;
        timeCode = Number(timeCode);
        this.stateList.forEach((state) => {
            if (state.closeTime === timeCode) {
                this.activeStates.push(state);
                const elem = document.getElementsByClassName(state.code);
                if (elem) {
                    elem[0].classList.add("too-early");
                }
            }
        });
        this.activeStates.forEach((state) => this.reportVote(state));
        console.log(this.hour + ":" + this.minute);
    }
    reportVote(state) {
        if (Math.random() < 0.3) {
            console.log(`reporting vote ${state.fullName}`);
            let rFactor = Math.random() * (0.1 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.1 - 0.01) + 0.01;
            console.log(rFactor);
            let rTranche = Math.ceil(state.rRemaining * rFactor);
            console.log(rTranche);
            let dTranche = Math.ceil(state.dRemaining * dFactor);
            state.rRemaining = state.rRemaining - rTranche;
            state.rReporting = state.rReporting + rTranche;
            state.dRemaining = state.dRemaining - dTranche;
            state.dReporting = state.dReporting + dTranche;
            if (!state.called) {
                if (state.prezMargin > 10 || state.prezMargin < -10) {
                    if (state.dReporting + state.rReporting > 1000) {
                        state.called = true;
                        if (state.prezMargin > 0) {
                            this.DEVs += state.evs;
                            const elem = document.getElementsByClassName(
                                state.code
                            );
                            if (elem) {
                                elem[0].classList.remove("too-early");
                                elem[0].classList.add("called-blue");
                            }
                        } else {
                            this.REVs += state.evs;
                            const elem = document.getElementsByClassName(
                                state.code
                            );
                            if (elem) {
                                elem[0].classList.remove("too-early");
                                elem[0].classList.add("called-red");
                            }
                        }
                    }
                }
                if (
                    state.dReporting - state.rReporting >
                        state.rRemaining * 0.9 ||
                    state.rReporting - state.dReporting > state.dRemaining * 0.9
                ) {
                    state.called = true;
                    if (state.prezMargin > 0) {
                        this.DEVs += state.evs;
                        const elem = document.getElementsByClassName(
                            state.code
                        );
                        if (elem) {
                            elem[0].classList.remove(
                                "too-early",
                                "leaning-blue",
                                "leaning-red"
                            );
                            elem[0].classList.add("called-blue");
                        }
                    } else {
                        this.REVs += state.evs;
                        const elem = document.getElementsByClassName(
                            state.code
                        );
                        if (elem) {
                            elem[0].classList.remove(
                                "too-early",
                                "leaning-blue",
                                "leaning-red"
                            );
                            elem[0].classList.add("called-red");
                        }
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
        }
    }
}

export { SimulationVM };
