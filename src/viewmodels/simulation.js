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
    instantiate(options) {
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
        this.stateList = Object.values(stateValues);
        this.stateCodes = Object.keys(stateValues);
        let nationalFactor = 0;
        if (baseError) {
            nationalFactor += Math.random() * (3 - -3) + -3;
        }
        nationalFactor += base;
        let neFactor = neSwing;
        if (neError) {
            neFactor += Math.random() * (1 - -1) + -1;
        }
        let sFactor = sSwing;
        if (sError) {
            sFactor += Math.random() * (1 - -1) + -1;
        }
        let mwFactor = mwSwing;
        if (mwError) {
            mwFactor += Math.random() * (1 - -1) + -1;
        }
        let mtFactor = mtSwing;
        if (mtError) {
            mtFactor += Math.random() * (1 - -1) + -1;
        }
        let swFactor = swSwing;
        if (swError) {
            swFactor += Math.random() * (1 - -1) + -1;
        }
        let wFactor = wSwing;
        if (wError) {
            wFactor += Math.random() * (1 - -1) + -1;
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
            let stateFactor = 0;
            if (stateError) {
                stateFactor = Math.random() * (2.2 - -2.2) + -2.2;
            }
            stateFactor += nationalFactor;
            state.prezMargin += stateFactor;
            state.prezMargin += state.regionalFactor;
            if (state.senateMargin) {
                state.senateMargin += stateFactor;
                state.senateMargin += state.regionalFactor;
                state.senateMargin += -1;
            }
            if (state.govMargin) {
                state.govMargin += stateFactor;
                state.govMargin += state.regionalFactor;
                state.govMargin += -1;
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
                let districtFactor = 0;
                if (distError) {
                    districtFactor = Math.random() * (4.2 - -4.2) + -4.2;
                }
                district.districtMargin += districtFactor;
                district.districtMargin += stateFactor * 2;
                district.districtMargin += state.regionalFactor * 2;
                district.districtMargin += -1;
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
            state.percentile = this.calculatePrezPercentile(state);
            if (state.senateMargin) {
                state.senPercentile = this.calculateSenatePercentile(state);
            }
            if (state.govMargin) {
                state.govPercentile = this.calculateGovPercentile(state);
            }
        });
        this.hour = "18";
        this.minute = "59";
        setInterval(() => {
            if (this.ticking) {
                this.tick();
            }
        }, 10);
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
                state.cooldown = 30;
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
        this.activeStates.forEach((state) => {
            this.reportVote(state);
            if (state.cooldown > 0) state.cooldown--;
        });
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
        if (Math.random() < state.countSpeed || state.dReporting === 0) {
            let rFactor = Math.random() * (0.07 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.07 - 0.01) + 0.01;
            rFactor -= state.cooldown / 200;
            dFactor -= state.cooldown / 200;
            if (rFactor < 0) rFactor = 0.01;
            if (dFactor < 0) dFactor = 0.01;
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
            state.percentile = this.calculatePrezPercentile(state);
            if (!state.called) {
                if (state.percentile > 120) {
                    this.callBlue(state);
                }
                if (state.percentile < -120) {
                    this.callRed(state);
                }
            }
            if (state.senateMargin) {
                state.senPercentile = this.calculateSenatePercentile(state);
                if (!state.senateCalled) {
                    if (state.senPercentile > 120) {
                        this.callBlueSen(state);
                    }
                    if (state.senPercentile < -120) {
                        this.callRedSen(state);
                    }
                }
            }
            if (state.govMargin) {
                state.govPercentile = this.calculateGovPercentile(state);
                if (!state.govCalled) {
                    if (state.govPercentile > 120) {
                        this.callBlueGov(state);
                    }
                    if (state.govPercentile < -120) {
                        this.callRedGov(state);
                    }
                }
            }
        }
    }
    reportDistrictVote(district) {
        if (Math.random() < district.countSpeed) {
            let rFactor = Math.random() * (0.07 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.07 - 0.01) + 0.01;
            let rTranche = Math.ceil(district.rRemaining * rFactor);
            let dTranche = Math.ceil(district.dRemaining * dFactor);
            district.rRemaining = district.rRemaining - rTranche;
            district.rReporting = district.rReporting + rTranche;
            district.dRemaining = district.dRemaining - dTranche;
            district.dReporting = district.dReporting + dTranche;
            district.percentile = this.calculateDistPercentile(district);
            if (!district.called) {
                if (district.percentile > 120) {
                    district.called = true;
                    this.DHouse++;
                    if (district.last === "R") {
                        this.DHouseGain++;
                        this.RHouseGain--;
                    }
                }
                if (district.percentile < -120) {
                    district.called = true;
                    this.RHouse++;
                    if (district.last === "D") {
                        this.RHouseGain++;
                        this.DHouseGain--;
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
    calculatePrezPercentile(state) {
        let dMaxFactor = Math.random() * (1.1 - 1.05) + 1.05;
        let dMinFactor = Math.random() * (0.95 - 0.9) + 0.9;
        let rMaxFactor = Math.random() * (1.1 - 1.05) + 1.05;
        let rMinFactor = Math.random() * (0.95 - 0.9) + 0.9;

        let dMax = Math.round(state.dRemaining * dMaxFactor) + state.dReporting;
        let dMin = Math.round(state.dRemaining * dMinFactor) + state.dReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax = Math.round(state.rRemaining * rMaxFactor) + state.rReporting;
        let rMin = Math.round(state.rRemaining * rMinFactor) + state.rReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        return (distance / totalWidth) * 100;
    }
    calculateSenatePercentile(state) {
        let dMaxFactor = Math.random() * (1.1 - 1.05) + 1.05;
        let dMinFactor = Math.random() * (0.95 - 0.9) + 0.9;
        let rMaxFactor = Math.random() * (1.1 - 1.05) + 1.05;
        let rMinFactor = Math.random() * (0.95 - 0.9) + 0.9;

        let dMax =
            Math.round(state.dSenRemaining * dMaxFactor) + state.dSenReporting;
        let dMin =
            Math.round(state.dSenRemaining * dMinFactor) + state.dSenReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax =
            Math.round(state.rSenRemaining * rMaxFactor) + state.rSenReporting;
        let rMin =
            Math.round(state.rSenRemaining * rMinFactor) + state.rSenReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        return (distance / totalWidth) * 100;
    }
    calculateGovPercentile(state) {
        let dMaxFactor = Math.random() * (1.1 - 1.05) + 1.05;
        let dMinFactor = Math.random() * (0.95 - 0.9) + 0.9;
        let rMaxFactor = Math.random() * (1.1 - 1.05) + 1.05;
        let rMinFactor = Math.random() * (0.95 - 0.9) + 0.9;

        let dMax =
            Math.round(state.dGovRemaining * dMaxFactor) + state.dGovReporting;
        let dMin =
            Math.round(state.dGovRemaining * dMinFactor) + state.dGovReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax =
            Math.round(state.rGovRemaining * rMaxFactor) + state.rGovReporting;
        let rMin =
            Math.round(state.rGovRemaining * rMinFactor) + state.rGovReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        return (distance / totalWidth) * 100;
    }
    calculateDistPercentile(dist) {
        let dMaxFactor = Math.random() * (1.3 - 1.1) + 1.1;
        let dMinFactor = Math.random() * (0.9 - 0.7) + 0.7;
        let rMaxFactor = Math.random() * (1.3 - 1.1) + 1.1;
        let rMinFactor = Math.random() * (0.9 - 0.7) + 0.7;

        let dMax = Math.round(dist.dRemaining * dMaxFactor) + dist.dReporting;
        let dMin = Math.round(dist.dRemaining * dMinFactor) + dist.dReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax = Math.round(dist.rRemaining * rMaxFactor) + dist.rReporting;
        let rMin = Math.round(dist.rRemaining * rMinFactor) + dist.rReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        return (distance / totalWidth) * 100;
    }
}

export default new SimulationVM();
