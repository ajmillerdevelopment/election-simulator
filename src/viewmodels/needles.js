class NeedleVM {
    calculatePrezPercentile(state) {
        let dMaxFactor = Math.random() * (1.07 - 1.05) + 1.05;
        let dMinFactor = Math.random() * (0.95 - 0.93) + 0.93;
        let rMaxFactor = Math.random() * (1.07 - 1.05) + 1.05;
        let rMinFactor = Math.random() * (0.95 - 0.93) + 0.93;

        let dEst = state.dExRemaining;
        let rEst = state.rExRemaining;

        let dMax = Math.round(dEst * dMaxFactor) + state.dReporting;
        let dMin = Math.round(dEst * dMinFactor) + state.dReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax = Math.round(rEst * rMaxFactor) + state.rReporting;
        let rMin = Math.round(rEst * rMinFactor) + state.rReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        let newPerc = (distance / totalWidth) * 100;
        if (state.percentile) {
            newPerc = (newPerc + state.percentile) / 2;
        }
        return newPerc;
    }
    calculateSenatePercentile(state) {
        let dMaxFactor = Math.random() * (1.06 - 1.05) + 1.05;
        let dMinFactor = Math.random() * (0.95 - 0.94) + 0.94;
        let rMaxFactor = Math.random() * (1.06 - 1.05) + 1.05;
        let rMinFactor = Math.random() * (0.95 - 0.94) + 0.94;

        let dEst = state.dSenExRemaining;
        let rEst = state.rSenExRemaining;

        let dMax = Math.round(dEst * dMaxFactor) + state.dSenReporting;
        let dMin = Math.round(dEst * dMinFactor) + state.dSenReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax = Math.round(rEst * rMaxFactor) + state.rSenReporting;
        let rMin = Math.round(rEst * rMinFactor) + state.rSenReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        let newPerc = (distance / totalWidth) * 100;
        if (state.senPercentile) {
            newPerc = (newPerc + state.senPercentile) / 2;
        }
        return newPerc;
    }
    calculateGovPercentile(state) {
        let dMaxFactor = Math.random() * (1.07 - 1.05) + 1.05;
        let dMinFactor = Math.random() * (0.95 - 0.93) + 0.93;
        let rMaxFactor = Math.random() * (1.07 - 1.05) + 1.05;
        let rMinFactor = Math.random() * (0.95 - 0.93) + 0.93;

        let dEst = state.dExGovRemaining;
        let rEst = state.rExGovRemaining;

        let dMax = Math.round(dEst * dMaxFactor) + state.dGovReporting;
        let dMin = Math.round(dEst * dMinFactor) + state.dGovReporting;
        let dMed = Math.round((dMax + dMin) / 2);

        let rMax = Math.round(rEst * rMaxFactor) + state.rGovReporting;
        let rMin = Math.round(rEst * rMinFactor) + state.rGovReporting;
        let rMed = Math.round((rMax + rMin) / 2);

        let dMaxMargin = dMax - rMin;
        let median = dMed - rMed;
        let rMaxMargin = dMin - rMax;
        let totalWidth = dMaxMargin - rMaxMargin;

        let distance = median - 0;
        let newPerc = (distance / totalWidth) * 100;
        if (state.govPercentile) {
            newPerc = (newPerc + state.govPercentile) / 2;
        }
        return newPerc;
    }
    calculateDistPercentile(dist) {
        let dMaxFactor = Math.random() * (1.3 - 1.07) + 1.07;
        let dMinFactor = Math.random() * (0.9 - 0.7) + 0.7;
        let rMaxFactor = Math.random() * (1.3 - 1.07) + 1.07;
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
// eslint-disable-next-line import/no-anonymous-default-export
export default new NeedleVM();
