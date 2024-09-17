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
            neFactor += this.roll(0, 1);
        }
        let sFactor = sSwing;
        if (sError) {
            sFactor += this.roll(0, 1);
        }
        let mwFactor = mwSwing;
        if (mwError) {
            mwFactor += this.roll(0, 1);
        }
        let mtFactor = mtSwing;
        if (mtError) {
            mtFactor += this.roll(0, 1);
        }
        let swFactor = swSwing;
        if (swError) {
            swFactor += this.roll(0, 1);
        }
        let wFactor = wSwing;
        if (wError) {
            wFactor += this.roll(0, 1);
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
                stateFactor += this.roll(0, 1);
            }
            if (state.prezMargin < 10 && state.prezMargin > -10) {
                stateFactor += nationalFactor / 1.2; //swing state races should be closer & less sensitive to polling swings
            } else {
                stateFactor += nationalFactor * 1.2;
            }
            state.prezMargin += state.regionalFactor;
            state.prezMargin += stateFactor;
            if (state.senateMargin) {
                state.senateMargin += stateFactor;
                state.senateMargin += state.regionalFactor;
                state.senateMargin += -1; //extra downballot juice for the GOP
                state.senateMargin +=
                    (state.prezMargin - state.senateMargin) / 4; //skew downballot statewides towards POTUS result
            }
            if (state.govMargin) {
                state.govMargin += stateFactor;
                state.govMargin += state.regionalFactor;
                state.govMargin += -1; //extra downballot juice for the GOP
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
                district.cooldown = 30;
                let districtFactor = 0;
                if (distError) {
                    districtFactor += this.roll(0, 3);
                }
                district.districtMargin += districtFactor;
                district.districtMargin += stateFactor * 2;
                district.districtMargin += state.regionalFactor * 2;
                // district.districtMargin -= 1; //Extra downballot juice for the GOP
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
            state.percentile = NeedleVM.calculatePrezPercentile(state);
            if (state.senateMargin) {
                state.senPercentile = NeedleVM.calculateSenatePercentile(state);
            }
            if (state.govMargin) {
                state.govPercentile = NeedleVM.calculateGovPercentile(state);
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
                this.speedCounter === 2
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
        }, 100);
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
                    this.log.push(
                        `${this.hour}:${this.minute} - Republicans flip NC-06!`
                    );
                    this.log.push(
                        `${this.hour}:${this.minute} - Republicans flip NC-13!`
                    );
                    this.log.push(
                        `${this.hour}:${this.minute} - Republicans flip NC-14!`
                    );
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
        this.activeStates.forEach((state) => {
            this.reportVote(state);
            if (state.cooldown > 0) state.cooldown--;
        });
        this.activeDistricts.forEach((district) => {
            this.reportDistrictVote(district);
            if (district.cooldown > 0) district.cooldown--;
        });
    }
    reportVote(state) {
        if (Math.random() < state.countSpeed / 1.8) {
            let rFactor = Math.random() * (0.07 - 0.01) + 0.01;
            let dFactor = Math.random() * (0.07 - 0.01) + 0.01;
            rFactor -= state.cooldown / 200;
            dFactor -= state.cooldown / 200;
            if (rFactor < 0) rFactor = 0.001;
            if (dFactor < 0) dFactor = 0.001;
            if (rFactor > 0 && dFactor <= 0) dFactor = 0.001;
            if (dFactor > 0 && rFactor <= 0) rFactor = 0.001;
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
            state.percentile = NeedleVM.calculatePrezPercentile(state);
            if (!state.called) {
                if (state.percentile > 100) {
                    this.callBlue(state);
                }
                if (state.percentile < -100) {
                    this.callRed(state);
                }
            }
            if (state.senateMargin) {
                state.senPercentile = NeedleVM.calculateSenatePercentile(state);
                if (!state.senateCalled) {
                    if (state.senPercentile > 100) {
                        this.callBlueSen(state);
                    }
                    if (state.senPercentile < -100) {
                        this.callRedSen(state);
                    }
                }
            }
            if (state.govMargin) {
                state.govPercentile = NeedleVM.calculateGovPercentile(state);
                if (!state.govCalled) {
                    if (state.govPercentile > 100) {
                        this.callBlueGov(state);
                    }
                    if (state.govPercentile < -100) {
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
            district.percentile = NeedleVM.calculateDistPercentile(district);
            if (!district.called) {
                if (district.percentile > 100) {
                    district.called = true;
                    this.DHouse++;
                    if (!this.houseCalled && this.DHouse >= 218) {
                        this.log.push(`Democrats flip the House!`);
                        this.houseCalled = true;
                    }
                    if (district.last === "R") {
                        this.DHouseGain++;
                        this.RHouseGain--;
                        this.log.push(
                            `${this.hour}:${this.minute} - Democrats flip ${district.districtName} (${district.incumbent})!`
                        );
                    } else if (
                        district.rating === "Tossup" ||
                        district.rating === "Lean D" ||
                        district.rating === "Lean R"
                    ) {
                        this.log.push(
                            `${this.hour}:${this.minute} - Democrats hold ${district.districtName} (${district.incumbent})`
                        );
                    }
                }
                if (district.percentile < -100) {
                    district.called = true;
                    this.RHouse++;
                    if (!this.houseCalled && this.RHouse >= 218) {
                        this.log.push(`Republicans hold the House!`);
                        this.houseCalled = true;
                    }
                    if (district.last === "D") {
                        this.RHouseGain++;
                        this.DHouseGain--;
                        this.log.push(
                            `${this.hour}:${this.minute} - Republicans flip ${district.districtName} (${district.incumbent})!`
                        );
                    } else if (
                        district.rating === "Tossup" ||
                        district.rating === "Lean D" ||
                        district.rating === "Lean R"
                    ) {
                        this.log.push(
                            `${this.hour}:${this.minute} - Republicans hold ${district.districtName} (${district.incumbent})`
                        );
                    }
                }
            }
        }
    }
    callBlue(state) {
        if (!state.called) {
            state.called = true;
            if (!this.called && this.DEVs + state.evs >= 270) {
                this.called = true;
                this.log.push(`Kamala Harris elected President!`);
            }
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
            this.log.push(
                `${this.hour}:${this.minute} - Harris wins ${state.fullName}`
            );
        }
    }
    callRed(state) {
        if (!state.called) {
            state.called = true;
            if (!this.called && this.REVs + state.evs >= 270) {
                this.called = true;
                this.log.push(`Donald Trump re-elected President!`);
            }
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
            this.log.push(
                `${this.hour}:${this.minute} - Trump wins ${state.fullName}`
            );
        }
    }
    callBlueSen(state) {
        if (!state.senateCalled) {
            state.senateCalled = true;
            this.DSen++;
            if (
                !this.senateCalled &&
                (this.DSen > 50 || (this.DSen === 5 && this.DEVs >= 270))
            ) {
                this.log.push(`Democrats hold the Senate!`);
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
            state.senateCalled = true;
            this.RSen++;
            if (
                !this.senateCalled &&
                (this.RSen > 50 || (this.RSen === 5 && this.REVs >= 270))
            ) {
                this.log.push(`Republicans flip the Senate!`);
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
            state.govCalled = true;
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
            state.govCalled = true;
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
