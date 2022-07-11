import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "33096";
var name = "Ata Theory";
var description = "Nice feature!";
var authors = "Throngjwk";
var version = "1.0.0";

var currency;
var a1;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(20, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency, new ExponentialCost(2048, Math.log2(1.9)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }

    // a3
    {
        let getDesc = (level) => "a_3=" + getA3(level).toString(0);
        a3 = theory.createUpgrade(1, currency, new ExponentialCost(1e5, Math.log2(1.9)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getDesc(a3.level), getDesc(a3.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e12);
    theory.createBuyAllUpgrade(1, currency, 1e30);
    theory.createAutoBuyerUpgrade(2, currency, 1e75);

    {
        let getDesc = (level) => "g=" + getG(level).toString(0);
        g = theory.createPermanentUpgrade(3, currency, new new ExponentialCost(1e6, Math.log2(1e3)));
        g.getDescription = (amount) => Utils.getMath(getDesc(g.level));
        g.getInfo = (amount) => Utils.getMathTo(getDesc(g.level), getDesc(g.level + amount));
    }

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(3, 1));
    
    /////////////////
    //// Achievements

    ///////////////////
    //// Story chapters

    updateAvailability();
}

var updateAvailability = () => {
    //something milestone upgrades.
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getA1(a1.level).sqrt() *
                                   ((getA2(a2.level) / 4) + 1) *
                                   (getA3(a3.level).sqrt() + 1)
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = \\sqrt{a_1}^{g + 1}";

    result += "(\\frac{a_2}{4} + 1)";

    result += "(\\sqrt{a_3} + 1)";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.2}";
var getPublicationMultiplier = (tau) => tau.pow(0.975) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.975}}{3}";
var getTau = () => currency.value.pow(0.2);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => BigNumber.from(2 * level)
var getA2 = (level) => BigNumber.from(2 * level)

init();
