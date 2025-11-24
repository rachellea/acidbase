/**
 * The function simpleAcidBase describes acid base disorders for which the pH
 * is abnormal: either < 7.35 or > 7.45. This function does NOT produce any
 * output for a normal pH in the range 7.35 <= pH <= 7.45.
 * For pH < 7.35, this function produces detailed output and compensation
 * calculations if HCO3 < 22 or PCO2 > 45, but does not do any compensation
 * calculations if HCO3 is higher or PCO2 is lower than those values.
 * For pH > 7.45, this function produces detailed output and compensation
 * calculations if HCO3 > 28 or PCO2 < 33, but does not do any compensation
 * calculations if HCO3 is lower or PCO2 is higher than those values.
 */

// no acid-base abnormalities detected
import {
    HAGMADiff,
    metabolicAlkalosisDiff,
    respiratoryAcidosisDiff,
    respiratoryAlkalosisDiff,
    NAGMADiff,
} from './differentialDiagnoses';

function simpleAcidBase(pH, HCO3, PCO2) {
    let primary = '';
    let secondary = ''; // for metabolic or acute respiratory process
    let secondary_chronic = ''; // for chronic respiratory process
    let returnObj = {
        primaryExp: '',
        secondaryExp: '',
        differentialDiagnoses: {
            description: [],
        },
    };
    const addIfUnique = (str) => {
        returnObj.differentialDiagnoses.description.forEach((stri) => {
            if (stri.includes(str)) {
                return;
            }
        });
        returnObj.differentialDiagnoses.description.push(str);
        return;
    };

    if (pH < 7.35) {
        returnObj.primaryExp =
            'pH of ' +
            pH.toString() +
            ' is < 7.35. Acidemia: primary disorder is acidosis. \n';
        if (HCO3 < 22) {
            // Metabolic acidosis
            returnObj.primaryExp +=
                'HCO3 of ' +
                HCO3.toString() +
                ' is < 22 so there is a metabolic acidosis. \n';
            primary = 'metabolic acidosis';

            // Calculate expected compensation for metabolic acidosis
            let mtAcidPCO2ExpLow = 1.5 * HCO3 + 8 - 2;
            let mtAcidPCO2ExpHigh = 1.5 * HCO3 + 8 + 2;

            if (PCO2 < mtAcidPCO2ExpLow) {
                returnObj.secondaryExp =
                    'PCO2 of ' +
                    PCO2.toString() +
                    ' is < expected PCO2 lower bound of ' +
                    mtAcidPCO2ExpLow.toString() +
                    ' so there is an additional respiratory alkalosis. \n';
                secondary = 'respiratory alkalosis';
                addIfUnique('Respiratory Alkalosis \n');
                addIfUnique(respiratoryAlkalosisDiff);
            } else if (PCO2 > mtAcidPCO2ExpHigh) {
                returnObj.secondaryExp =
                    'PCO2 of ' +
                    PCO2.toString() +
                    ' is > expected PCO2 upper bound of ' +
                    mtAcidPCO2ExpHigh.toString() +
                    ' so there is an additional respiratory acidosis. \n';
                secondary = 'respiratory acidosis';
                addIfUnique('Respiratory Acidosis \n');
                addIfUnique(respiratoryAcidosisDiff);
            } else {
                returnObj.secondaryExp =
                    'PCO2 of ' +
                    PCO2.toString() +
                    ' is within the expected range of ' +
                    mtAcidPCO2ExpLow.toString() +
                    ' to ' +
                    mtAcidPCO2ExpHigh.toString() +
                    ' so there is adequate respiratory compensation. \n';
                secondary = 'adequate respiratory compensation';
            }
        }

        if (PCO2 > 45) {
            // Respiratory acidosis
            returnObj.primaryExp +=
                'PCO2 of ' +
                PCO2.toString() +
                ' is > 45 so there is a respiratory acidosis. \n';
            primary = 'Respiratory acidosis';
            addIfUnique('Respiratory Acidosis \n');
            addIfUnique(respiratoryAcidosisDiff);

            // Calculate expected compensation for acute respiratory acidosis
            let rsAcidHCO3ExpAcute = 24 + 0.1 * (PCO2 - 40);
            returnObj.secondaryExp +=
                'For acute respiratory acidosis, expected HCO3 is 24 + (0.1*(PCO2-40)) = ' +
                rsAcidHCO3ExpAcute.toString() +
                '\n';

            if (HCO3 < rsAcidHCO3ExpAcute) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is < expected HCO3 of ' +
                    rsAcidHCO3ExpAcute.toString() +
                    ' so there is an additional metabolic acidosis. \n';
                secondary = 'metabolic acidosis';
            } else if (HCO3 > rsAcidHCO3ExpAcute) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is > expected HCO3 of ' +
                    rsAcidHCO3ExpAcute.toString() +
                    ' so there is an additional metabolic alkalosis. \n';
                addIfUnique('Metabolic Alkalosis \n');
                addIfUnique(metabolicAlkalosisDiff);
                secondary = 'metabolic alkalosis';
            } else {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is equal to expected HCO3 of ' +
                    rsAcidHCO3ExpAcute.toString() +
                    ' so there is adequate metabolic compensation. \n';
                secondary = 'adequate metabolic compensation';
            }

            // Calculate expected compensation for chronic respiratory acidosis
            let rsAcidHCO3ExpChronic = 24 + 0.35 * (PCO2 - 40);
            returnObj.primaryExp +=
                'For chronic respiratory acidosis, expected HCO3 is 24 + (0.35*(PCO2-40)) = ' +
                rsAcidHCO3ExpChronic.toString() +
                '\n';
            if (HCO3 < rsAcidHCO3ExpChronic) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is < expected HCO3 of ' +
                    rsAcidHCO3ExpChronic.toString() +
                    ' so there is an additional metabolic acidosis. \n';
                secondary_chronic = 'metabolic acidosis';
            } else if (HCO3 > rsAcidHCO3ExpChronic) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is > expected HCO3 of ' +
                    rsAcidHCO3ExpChronic.toString() +
                    ' so there is an additional metabolic alkalosis. \n';
                addIfUnique('Metabolic Alkalosis \n');
                addIfUnique(metabolicAlkalosisDiff);
                secondary_chronic = 'metabolic alkalosis';
            } else {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is equal to expected HCO3 of ' +
                    rsAcidHCO3ExpChronic.toString() +
                    ' so there is adequate metabolic compensation. \n';
                secondary_chronic = 'adequate metabolic compensation';
            }
        }
    } else if (pH > 7.45) {
        returnObj.primaryExp +=
            'pH of ' +
            pH.toString() +
            ' is > 7.45. Alkalemia: primary disorder is alkalosis. \n';

        if (HCO3 > 28) {
            // Metabolic alkalosis
            returnObj.primaryExp +=
                'HCO3 of ' +
                HCO3.toString() +
                ' is > 28 so there is a metabolic alkalosis. \n';
            primary = 'metabolic alkalosis';
            addIfUnique('Metabolic Alkalosis \n');
            addIfUnique(metabolicAlkalosisDiff);

            // Calculate expected compensation for metabolic alkalosis
            let mtAlkPCO2ExpLow = 0.7 * (HCO3 - 24) + 40 - 2;
            let mtAlkPCO2ExpHigh = 0.7 * (HCO3 - 24) + 40 + 2;

            returnObj.secondaryExp +=
                'For primary metabolic alkalosis, expected PCO2 is (0.7*(HCO3-24)) + 40 +/- 2 = ' +
                mtAlkPCO2ExpLow.toString() +
                ' to ' +
                mtAlkPCO2ExpHigh.toString() +
                '\n';

            if (PCO2 < mtAlkPCO2ExpLow) {
                returnObj.secondaryExp +=
                    'PCO2 of ' +
                    PCO2.toString() +
                    ' is < expected PCO2 lower bound of ' +
                    mtAlkPCO2ExpLow.toString() +
                    ' so there is an additional respiratory alkalosis. \n';
                secondary = 'respiratory alkalosis';
                addIfUnique('Respiratory Alkalosis \n');
                addIfUnique(respiratoryAlkalosisDiff);
            } else if (PCO2 > mtAlkPCO2ExpHigh) {
                returnObj.secondaryExp +=
                    'PCO2 of ' +
                    PCO2.toString() +
                    ' is > expected PCO2 upper bound of ' +
                    mtAlkPCO2ExpHigh.toString() +
                    ' so there is an additional respiratory acidosis. \n';
                secondary = 'respiratory acidosis';
                addIfUnique('Respiratory Acidosis \n');
                addIfUnique(respiratoryAcidosisDiff);
            } else {
                returnObj.secondaryExp +=
                    'PCO2 of ' +
                    PCO2.toString() +
                    ' is within the expected range of ' +
                    mtAlkPCO2ExpLow.toString() +
                    ' to ' +
                    mtAlkPCO2ExpHigh.toString() +
                    ' so there is adequate respiratory compensation. \n';
                secondary = 'adequate respiratory compensation';
            }
        }

        if (PCO2 < 33) {
            // Respiratory alkalosis
            returnObj.primaryExp +=
                'PCO2 of ' +
                PCO2.toString() +
                ' is < 33 so there is a respiratory alkalosis. \n';
            primary = 'respiratory alkalosis';
            addIfUnique('Respiratory Alkalosis \n');
            addIfUnique(respiratoryAlkalosisDiff);

            // Calculate expected compensation for acute respiratory alkalosis
            let rsAlkHCO3ExpAcute = 24 - 0.2 * (40 - PCO2);

            returnObj.secondaryExp +=
                'For acute respiratory alkalosis, expected HCO3 is 24 - (0.2*(40-PCO2)) = ' +
                rsAlkHCO3ExpAcute.toString() +
                '\n';

            if (HCO3 < rsAlkHCO3ExpAcute) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is < expected HCO3 of ' +
                    rsAlkHCO3ExpAcute.toString() +
                    ' so there is an additional metabolic acidosis. \n';
                secondary = 'metabolic acidosis';
            } else if (HCO3 > rsAlkHCO3ExpAcute) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is > expected HCO3 of ' +
                    rsAlkHCO3ExpAcute.toString() +
                    ' so there is an additional metabolic alkalosis. \n';
                secondary = 'metabolic alkalosis';
                addIfUnique('Metabolic Alkalosis \n');
                addIfUnique(metabolicAlkalosisDiff);
                secondary = 'metabolic alkalosis';
            } else {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is equal to expected HCO3 of ' +
                    rsAlkHCO3ExpAcute.toString() +
                    ' so there is adequate metabolic compensation. \n';
                secondary = 'adequate metabolic compensation';
            }

            // Calculate expected compensation for chronic respiratory alkalosis
            let rsAlkHCO3ExpChronic = 24 - 0.4 * (40 - PCO2);
            returnObj.secondaryExp +=
                'For chronic respiratory alkalosis, expected HCO3 is 24 - (0.4*(40-PCO2)) = ' +
                rsAlkHCO3ExpChronic.toString() +
                '\n';
            if (HCO3 < rsAlkHCO3ExpChronic) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is < expected HCO3 of ' +
                    rsAlkHCO3ExpChronic.toString() +
                    ' so there is an additional metabolic acidosis. \n';
                secondary_chronic = 'metabolic acidosis';
            } else if (HCO3 > rsAlkHCO3ExpChronic) {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is > expected HCO3 of ' +
                    rsAlkHCO3ExpChronic.toString() +
                    ' so there is an additional metabolic alkalosis. \n';
                secondary_chronic = 'metabolic alkalosis';
                addIfUnique('Metabolic Alkalosis \n');
                addIfUnique(metabolicAlkalosisDiff);
                secondary_chronic = 'metabolic alkalosis';
            } else {
                returnObj.secondaryExp +=
                    'HCO3 of ' +
                    HCO3.toString() +
                    ' is equal to expected HCO3 of ' +
                    rsAlkHCO3ExpChronic.toString() +
                    ' so there is adequate metabolic compensation. \n';
                secondary_chronic = 'adequate metabolic compensation';
            }
        }
    }
    return [primary, secondary, secondary_chronic, returnObj];
}

/**
 * The function anionGapWithDeltas calculates the anion gap, the
 * delta-delta (delta ratio) and the delta gap.
 */
function anionGapWithDeltas(Na, Cl, HCO3, albumin = 4.8, returnObj) {
    let anionObj = {
        calculatedAnionGap: '',
        expectedAnionGap: '',
        deltaAG: '',
        deltaDelta: '',
        deltaDeltaExp: '',
        deltaHCO3: '',
        gap: '',
    };
    const addIfUnique = (str) => {
        returnObj.differentialDiagnoses.description.forEach((stri) => {
            if (stri.includes(str)) {
                return;
            }
        });
        returnObj.differentialDiagnoses.description.push(str);
        return;
    };
    // Since albumin has a default value of 4.8 specify if this value is being
    // used (if the user did not specify the albumin we need to tell them the
    // default value that was used.)
    if (albumin == 4.8) {
        // defaulted to 4.8 -
        anionObj.albuminDefault = 'Albumin defaulted to 4.8';
    }

    let gapSummary = '';

    let calculatedAnionGap = Na - Cl - HCO3;

    anionObj.calculatedAnionGap +=
        'Calculated anion gap = Na ' +
        Na.toString() +
        ' - Cl ' +
        Cl.toString() +
        ' - HCO3 ' +
        HCO3.toString() +
        ' = ' +
        calculatedAnionGap +
        '\n';

    let expectedAnionGap = 2.5 * albumin;
    anionObj.expectedAnionGap +=
        'Expected anion gap = 2.5*albumin = 2.5*' +
        albumin.toString() +
        ' = ' +
        expectedAnionGap.toString() +
        '\n';

    // Calculate the parts of the delta-delta (delta ratio) and the delta gap
    let deltaAG = calculatedAnionGap - expectedAnionGap;

    anionObj.deltaAG +=
        'deltaAG = calculated anion gap - expected anion gap = ' +
        calculatedAnionGap.toString() +
        ' - ' +
        expectedAnionGap.toString() +
        ' = ' +
        deltaAG.toString();
    if (calculatedAnionGap > expectedAnionGap) {
        anionObj.gap +=
            'High anion gap: calculated anion gap is higher than expected anion gap.';
    } else {
        anionObj.gap +=
            'Low or normal anion gap: calculated anion gap is less than or equal to expected anion gap.';
    }

    let deltaHCO3 = 24 - HCO3;
    anionObj.deltaHCO3 +=
        'deltaHCO3 = 24 - HCO3 = 24 - ' +
        HCO3.toString() +
        ' = ' +
        deltaHCO3.toString() +
        '\n';

    // Calculate the delta-delta (delta ratio)
    // See https://www.timeofcare.com/the-delta-anion-gap-delta-bicarb-ratio/
    // for the formulas.
    // See https://litfl.com/delta-ratio/ for the interpretation.
    let deltaDelta = deltaAG / deltaHCO3;
    anionObj.deltaDelta +=
        'Delta-delta (aka delta ratio) = deltaAG / deltaHCO3 = ' +
        deltaAG.toString() +
        ' / ' +
        deltaHCO3.toString() +
        ' = ' +
        deltaDelta.toFixed(2).toString();
    if (deltaDelta < 0.4) {
        anionObj.deltaDeltaExp += 'Delta-delta < 0.4: NAGMA';
        addIfUnique('Metabolic Acidosis: NAGMA \n');
        addIfUnique(NAGMADiff);
        gapSummary = 'NAGMA';
    } else if (0.4 <= deltaDelta && deltaDelta <= 1) {
        addIfUnique('Metabolic Acidosis: Consider combined HAGMA + NAGMA \n');
        addIfUnique(NAGMADiff + ' ' + HAGMADiff);
        anionObj.deltaDeltaExp +=
            'Delta-delta between 0.4 and 1.0: consider combined HAGMA + NAGMA \n';
        gapSummary = 'HAGMA + NAGMA';
    } else if (1 < deltaDelta && deltaDelta < 2) {
        anionObj.deltaDeltaExp += 'Delta-delta between 1 and 2: HAGMA \n';
        gapSummary = 'HAGMA';
        addIfUnique('Metabolic Acidosis: HAGMA \n');
        addIfUnique(HAGMADiff);
    } else if (deltaDelta >= 2) {
        anionObj.deltaDeltaExp +=
            'Delta-delta > 2: consider combined HAGMA + metabolic alkalosis, OR combined HAGMA + compensation for chronic respiratory acidosis';
        gapSummary =
            'HAGMA + metabolic alkalosis, OR HAGMA + compensation for chronic respiratory acidosis';
    }

    // // Calculate the delta gap
    // // See https://www.timeofcare.com/the-delta-gap/
    // // Note: there is an alternative formula for the delta gap
    // // in which they allow the HCO3 to cancel out, yielding Na-Cl-36 as the
    // // delta gap formula, but I am not implementing the delta gap that way since
    // // I think the HCO3 will almost always be available.
    // deltaGap = deltaAG - deltaHCO3;
    // console.log("Delta gap = deltaAG - deltaHCO3 = "+deltaAG.toString()+" - "+deltaHCO3.toString()+" = "+deltaGap.toString());

    // if (deltaGap < -6) {
    //     console.log("Delta gap is <-6: consider combined HAGMA + NAGMA.");
    // } else if (-6 <= deltaGap <= 6) {
    //     console.log("Delta gap is between -6 to 6: HAGMA.");
    // } else if (deltaGap > 6) {
    //     console.log("Delta gap is >6: consider combined HAGMA + metabolic alkalosis.")
    // }
    return [gapSummary, anionObj, returnObj];
}

/**
 * The function runAnalysis runs a full acid base analysis by calling
 * simpleAcidBase and anionGapWithDeltas.
 * Note that the albumin argument is optional. The default value of 4.8
 * for albumin was obtained as follows:
 * normal albumin is 3.4 to 5.4 g/dL
 * normal anion gap is 10—16 mEq/L; the value typically chosen as the default
 * in delta-delta calculations is 12.
 * Solving for 2.5*albumin = 12 yields albumin = 4.8 so that is why we
 * choose albumin of 4.8 as the default value for albumin.
 */
function runAnalysis(pH, HCO3, PCO2, Na, Cl, albumin) {
    let [primary, secondary, secondary_chronic, returnObj] = simpleAcidBase(
        pH,
        HCO3,
        PCO2
    );
    let gapSummary, anionObj;
    [gapSummary, anionObj, returnObj] = anionGapWithDeltas(
        Na,
        Cl,
        HCO3,
        albumin,
        returnObj
    );

    // Construct the summary string
    // If there is a secondary_chronic specified then there is a secondary
    // specified
    let overallSummary = primary;
    if (secondary_chronic != '') {
        if (secondary == secondary_chronic) {
            overallSummary = overallSummary + ' with ' + secondary.toString();
        } else {
            // secondary and secondary_chronic disagree meaning there is
            // a different secondary option depending on whether the
            // respiratory issue is acute or chronic
            overallSummary =
                overallSummary +
                ' with ' +
                secondary.toString() +
                ' (acute respiratory) or ' +
                secondary_chronic.toString() +
                ' (chronic respiratory)';
        }
    } else if (secondary != '') {
        overallSummary = overallSummary + ' with ' + secondary.toString();
    }

    if (gapSummary != '') {
        overallSummary =
            overallSummary + '. The metabolic acidosis is ' + gapSummary;
    }

    let acidBaseResults = {
        acidTest: returnObj,
        anion: anionObj,
        summary: overallSummary,
    };
    return acidBaseResults;
}

// runAnalysis(pH = 7.40, HCO3 = 23, PCO2 = 40, Na = 150, Cl = 87, albumin = 4.8);

// runAnalysis(pH = 7.53, HCO3 = 12, PCO2 = 15, Na = 140, Cl = 108, albumin = 4.8);

// TODO - write unit tests that check the values of primary, secondary,
// secondary_chronic, and gapSummary. Ask the medical interns
// to turn the case studies into an Excel table with the expected values of
// the different variables along with the input values so it's easy to
// write a bunch of unit tests.

// TODO: change this so instead of console.log, instead strings are returned.
// Do this so that the strings can be displayed on the site.

// TODO: add a differential diagnosis function that detects the different
// disorders specified in the summary string and then prints off the
// differential diagnosis for each disorder.
// So for example if HAGMA is in the string it lists off what causes
// HAGMA.

// in the UI: boxes to enter elements of the ABG, then below, the one-sentence
// summary appears, and then there are 2 plus buttons one for "Show Calculations"
// and another for "Show Differential Diagnosis" which will expand the
// additional material.

// add a footnote specifying what NAGMA and HAGMA stand for.

// maybe check work with https://www.mdcalc.com/arterial-blood-gas-abg-analyzer  ???

export default runAnalysis;