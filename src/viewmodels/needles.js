class NeedleVM {
    constructor() {}
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
export default new NeedleVM();
