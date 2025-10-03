var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var billingCycle;
(function (billingCycle) {
    billingCycle["Monthly"] = "monthly";
    billingCycle["Yearly"] = "yearly";
})(billingCycle || (billingCycle = {}));
const billingDetails = {
    [billingCycle.Monthly]: {
        arcade: 9,
        advanced: 12,
        pro: 15,
        onlineService: 1,
        largerStorage: 2,
        customizableProfile: 2,
        abbr: {
            short: 'mo',
            normal: 'month',
            long: 'Monthly'
        }
    },
    [billingCycle.Yearly]: {
        arcade: 90,
        advanced: 120,
        pro: 150,
        onlineService: 10,
        largerStorage: 20,
        customizableProfile: 20,
        abbr: {
            short: 'yr',
            normal: 'year',
            long: 'Yearly'
        }
    }
};
Object.freeze(billingDetails);
Object.freeze(billingDetails[billingCycle.Monthly]);
Object.freeze(billingDetails[billingCycle.Yearly]);
class switchBetweenPages {
    constructor() {
        this.step1 = document.querySelector('.js-step1-btn');
        this.step2 = document.querySelector('.js-step2-btn');
        this.step3 = document.querySelector('.js-step3-btn');
        this.step4 = document.querySelector('.js-step4-btn');
        this.stepContainer = document.querySelector('.switch-step');
        this.currentStep = 4;
        this.steps = [this.step1, this.step2, this.step3, this.step4];
        this.allSteps = document.querySelectorAll('.step');
        this.colorVariables = {
            b950: 'hsl(213, 96%, 18%)',
            p600: 'hsl(243, 100%, 62%)',
            b300: 'hsl(228, 100%, 84%)',
            b200: 'hsl(206, 94%, 87%)',
            r500: 'hsl(354, 84%, 57%)',
            g500: 'hsl(231, 11%, 63%)',
            p200: 'hsl(229, 24%, 87%)',
            b100: 'hsl(218, 100%, 97%)',
            b50: 'hsl(231, 100%, 99%)',
            w: 'hsl(0, 100%, 100%)'
        };
        this.validPages = 1;
        this.savedValues = {
            step1: {
                name: '',
                email: '',
                phone: ''
            },
            step2: {
                plan: 'arcade',
                cycle: billingCycle.Monthly,
                toggleSwitchDir: 'left'
            },
            step3: {
                addons: []
            }
        };
        this.constructorCode = () => __awaiter(this, void 0, void 0, function* () {
            this.addNavEvents();
            yield this.switchPages();
            this.checkForActiveAddons();
        });
        this.stepCode = (stepToGo) => __awaiter(this, void 0, void 0, function* () {
            if (stepToGo !== this.currentStep) {
                const f = yield this.fetchHTML(stepToGo);
                return f;
            }
        });
        this.fetchHTML = (stepToGo) => {
            const f = fetch(`steps-code/step${stepToGo}.txt`).then(res => {
                return res.text();
            });
            return f;
        };
        this.switchPages = (...args_1) => __awaiter(this, [...args_1], void 0, function* (step = 1) {
            var _a;
            // this.transition('out')
            this.slideOut('start', step);
            this.stepContainer.innerHTML = (_a = yield this.stepCode(step)) !== null && _a !== void 0 ? _a : 'Please refresh page';
            this.updateSavedValues(step);
            this.changeHeaders(step);
            this.currentStep = step;
            this.updatePrevBtn();
            this.updateNextBtn();
            this.changeActiveElement();
            this.addActiveStates();
            // this.transition('in');
            this.slideOut('end', step);
            if (this.currentStep === 5)
                this.currentStep = 6;
        });
        this.updateSavedValues = (step) => {
            if (step === 1) {
                const stepOneInputs = document.querySelectorAll('.step-1 input');
                const o = this.savedValues.step1;
                if (o) {
                    if (o.name && typeof o.name === 'string')
                        stepOneInputs[0].value = o.name;
                    if (o.email && typeof o.email === 'string')
                        stepOneInputs[1].value = o.email;
                    if (o.phone && typeof o.phone === 'string')
                        stepOneInputs[2].value = o.phone;
                }
            }
            else if (step === 2) {
                const plans = document.querySelectorAll('.plan');
                plans.forEach(p => {
                    p.classList.remove('plan-select');
                    if (this.savedValues.step2) {
                        if (p.dataset.plan === this.savedValues.step2.plan) {
                            p.classList.add('plan-select');
                        }
                    }
                });
            }
            else if (step === 3) {
                this.recallClickedAddons();
                this.updateAddonPrice();
            }
            else if (step === 4) {
                this.updatePaymentSummary();
            }
        };
        this.switchSteps = () => {
            if (this.currentStep === 1) {
                if (this.checkRequiredContents()) {
                    this.switchPages(2);
                    if (this.validPages <= 2)
                        this.validPages = 2;
                }
            }
            else {
                this.switchPages(this.currentStep + 1);
                if (this.validPages <= this.currentStep + 1)
                    this.validPages = this.currentStep + 1;
            }
            this.selectValidNav();
        };
        this.updatePrevBtn = () => {
            const previousBtn = document.querySelector('.previous');
            if (this.currentStep === 1) {
                if (previousBtn)
                    previousBtn.style.display = "none";
            }
            else if (previousBtn)
                previousBtn.style.display = "block";
        };
        this.updateNextBtn = () => {
            const nextBtn = document.querySelector('.action-btns .next');
            if (this.currentStep === 4) {
                nextBtn.innerHTML = 'Confirm';
                nextBtn.classList.add('last');
            }
            else {
                nextBtn.innerHTML = 'Next Step';
                nextBtn.classList.remove('last');
            }
        };
        this.addNavEvents = () => {
            const nextBtn = document.querySelector('.action-btns .next');
            const previousBtn = document.querySelector('.previous');
            this.steps.forEach((stepBtn, index) => {
                const step = index + 1;
                stepBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                    if (this.currentStep !== step && this.validPages >= step && this.currentStep !== 6) {
                        this.switchPages(step);
                    }
                }));
            });
            nextBtn.addEventListener('click', this.switchSteps);
            previousBtn === null || previousBtn === void 0 ? void 0 : previousBtn.addEventListener('click', () => {
                this.switchPages(this.currentStep - 1);
            });
        };
        this.changeHeaders = (goToStep) => {
            const mainHeader = document.querySelector('h1');
            const subHeader = document.querySelector('h4');
            const actionBtns = document.querySelector('.action-btns');
            const display = document.querySelector('.details-container');
            if (goToStep === 1) {
                if (mainHeader)
                    mainHeader.innerHTML = 'Personal Info';
                if (subHeader)
                    subHeader.innerHTML = 'Please provide your name, email address, and phone number.';
            }
            else if (goToStep === 2) {
                if (mainHeader)
                    mainHeader.innerHTML = 'Select your plan';
                if (subHeader)
                    subHeader.innerHTML = 'You have the option of monthly or yearly billing.';
            }
            else if (goToStep === 3) {
                if (mainHeader)
                    mainHeader.innerHTML = 'Pick add-ons';
                if (subHeader)
                    subHeader.innerHTML = 'Add-ons help enhance your gaming experience.';
            }
            else if (goToStep === 4) {
                if (mainHeader)
                    mainHeader.innerHTML = 'Finishing up';
                if (subHeader)
                    subHeader.innerHTML = 'Double-check everything looks OK before continuing.';
            }
            else if (goToStep === 5) {
                mainHeader.style.display = "none";
                subHeader.style.display = "none";
                actionBtns.style.display = "none";
                display === null || display === void 0 ? void 0 : display.classList.add('center');
            }
        };
        this.changeActiveElement = () => {
            var _a;
            this.allSteps.forEach(step => {
                step.classList.remove('active');
            });
            (_a = this.allSteps[this.currentStep - 1]) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        };
        this.checkRequiredContents = () => {
            var _a;
            let noError = true;
            const stepOneInputs = document.querySelectorAll('.step-1 input');
            const stepOneLabels = document.querySelectorAll('.step-1 label .error-message');
            const validation = {};
            const allAlphabet = /^[A-Za-z\s]+$/;
            const emailVerification = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const numberVerification = /^\+?[\d\s]+$/;
            const notFilled = {
                0: false,
                1: false,
                2: false
            };
            let allFilled = true;
            stepOneInputs.forEach((input, index) => {
                if (input.value.length > 0) {
                    notFilled[index] = true;
                }
            });
            for (let key in notFilled) {
                if (!notFilled[key]) {
                    allFilled = false;
                    let p = stepOneLabels[+key];
                    let i = stepOneInputs[+key];
                    if (p && i) {
                        p.innerHTML = 'This field is required';
                        i.style.borderColor = this.colorVariables.r500;
                        i.addEventListener('input', () => {
                            p.innerHTML = '';
                            i.style.borderColor = '';
                        });
                    }
                }
            }
            noError = allFilled;
            if (allFilled) {
                if (stepOneInputs[0])
                    if (allAlphabet.test(stepOneInputs[0].value))
                        validation.name = this.checkForError('name', stepOneInputs[0].value);
                    else {
                        validation.name = {
                            error: true,
                            errorMessage: 'This field must contain only alphabets'
                        };
                    }
                if (stepOneInputs[1])
                    if (emailVerification.test(stepOneInputs[1].value))
                        validation.email = {
                            error: false,
                            errorMessage: ''
                        };
                    else {
                        validation.email = {
                            error: true,
                            errorMessage: 'This email is not valid'
                        };
                    }
                if (stepOneInputs[2])
                    if (numberVerification.test(stepOneInputs[2].value))
                        validation.phone = this.checkForError('phone', stepOneInputs[2].value);
                    else {
                        validation.phone = {
                            error: true,
                            errorMessage: 'This number is not valid'
                        };
                    }
                for (let err in validation) {
                    if ((_a = validation[err]) === null || _a === void 0 ? void 0 : _a.error) {
                        noError = false;
                        const elem = document.querySelector(`.js-${err}`);
                        const p = document.querySelector(`.js-label-${err} .error-message`);
                        if (elem)
                            elem.style.borderColor = this.colorVariables.r500;
                        if (p)
                            p.innerHTML = validation[err].errorMessage;
                        elem === null || elem === void 0 ? void 0 : elem.addEventListener('input', () => {
                            if (p)
                                p.innerHTML = '';
                            elem.style.borderColor = '';
                        });
                    }
                }
            }
            if (noError) {
                if (this.savedValues.step1) {
                    this.savedValues.step1.name = stepOneInputs[0].value;
                    this.savedValues.step1.email = stepOneInputs[1].value;
                    this.savedValues.step1.phone = stepOneInputs[2].value;
                }
            }
            return noError;
        };
        this.checkForError = (type, value) => {
            const returnValue = {
                error: false,
                errorMessage: ''
            };
            if (type === 'name') {
                const spl = value.split(' ');
                const validSpl = spl.filter(w => w.length !== 0);
                if (validSpl.length === 1) {
                    returnValue.error = true;
                    returnValue.errorMessage = 'Please enter your full name (first and last)';
                }
                else if (validSpl.length > 3) {
                    returnValue.error = true;
                    returnValue.errorMessage = 'Please enter only TWO or THREE names';
                }
            }
            else if (type === 'phone') {
                let modifiedValue = value;
                if (value.includes(' ')) {
                    const spl = value.split(' ');
                    modifiedValue = '';
                    spl.forEach(c => {
                        modifiedValue += c;
                    });
                }
                if (modifiedValue.includes('+')) {
                    const spl = modifiedValue.split('');
                    modifiedValue = spl.filter(c => c !== '+').join('');
                }
                if (modifiedValue.length < 7) {
                    returnValue.error = true;
                    returnValue.errorMessage = 'Please enter at least 7 digits.';
                }
            }
            return returnValue;
        };
        this.switchPlansEvent = () => {
            const plans = document.querySelectorAll('.plan');
            plans.forEach((plan, index) => {
                const planTitle = plan.dataset.plan;
                plan.addEventListener('click', () => {
                    var _a;
                    plans.forEach(p => { p.classList.remove('plan-select'); });
                    plan.classList.add('plan-select');
                    if ((_a = this.savedValues.step2) === null || _a === void 0 ? void 0 : _a.plan)
                        this.savedValues.step2.plan = planTitle;
                });
            });
            this.toggleCycle();
        };
        this.toggleCycle = () => {
            const cycleSwitch = document.querySelector('.toggle-switch');
            const cycleBall = document.querySelector('.toggle-ball');
            cycleSwitch.addEventListener('mouseenter', () => {
                this.animateBallMovement('increase');
            });
            cycleSwitch.addEventListener('mouseleave', () => {
                this.animateBallMovement('decrease');
            });
            cycleSwitch.addEventListener('click', () => {
                let currentCycle;
                if (typeof this.savedValues.step2.cycle === 'string')
                    currentCycle = this.savedValues.step2.cycle;
                if (currentCycle === billingCycle.Monthly) {
                    this.savedValues.step2.cycle = billingCycle.Yearly;
                    this.animateBallMovement('right');
                }
                else {
                    this.savedValues.step2.cycle = billingCycle.Monthly;
                    this.animateBallMovement('left');
                }
                this.switchCycle();
                this.updatePlanInfo();
            });
        };
        this.animateBallMovement = (direction) => {
            const cycleBall = document.querySelector('.toggle-ball');
            let leftValue = '.25';
            let rightValue = 'unset';
            const unit = 'rem';
            let dir;
            if (this.savedValues.step2.toggleSwitchDir && typeof this.savedValues.step2.toggleSwitchDir === 'string')
                dir = this.savedValues.step2.toggleSwitchDir;
            if (direction === 'right') {
                leftValue = 'unset';
                rightValue = '.25';
                this.savedValues.step2.toggleSwitchDir = 'right';
                cycleBall.animate([
                    {
                        left: rightValue + unit,
                        right: leftValue
                    },
                    {
                        left: leftValue,
                        right: rightValue + unit
                    }
                ], {
                    duration: 150,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
            }
            else if (direction === 'left') {
                leftValue = '.25';
                rightValue = 'unset';
                this.savedValues.step2.toggleSwitchDir = 'left';
                cycleBall.animate([
                    {
                        left: rightValue,
                        right: leftValue + unit
                    },
                    {
                        left: leftValue + unit,
                        right: rightValue
                    }
                ], {
                    duration: 150,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
            }
            else if (direction === 'increase') {
                cycleBall.animate([
                    {
                        left: this.getDir(dir, 'left', 'from'),
                        top: ".25rem",
                        bottom: ".25rem",
                        width: ".9rem",
                        right: this.getDir(dir, 'right', 'from')
                    },
                    {
                        left: this.getDir(dir, 'left', 'to'),
                        top: ".15rem",
                        bottom: ".15rem",
                        width: "1.1rem",
                        right: this.getDir(dir, 'right', 'to')
                    }
                ], {
                    duration: 150,
                    iterations: 1,
                    fill: "forwards",
                    easing: "ease-in-out"
                });
            }
            else if (direction === 'decrease') {
                cycleBall.animate([
                    {
                        left: this.getDir(dir, 'left', 'to'),
                        top: ".15rem",
                        bottom: ".15rem",
                        width: "1.1rem",
                        right: this.getDir(dir, 'right', 'to')
                    },
                    {
                        left: this.getDir(dir, 'left', 'from'),
                        top: ".25rem",
                        bottom: ".25rem",
                        width: ".9rem",
                        right: this.getDir(dir, 'right', 'from')
                    }
                ], {
                    duration: 150,
                    iterations: 1,
                    fill: "forwards",
                    easing: "ease-in-out"
                });
            }
        };
        this.switchCycle = () => {
            var _a, _b;
            const cyclePara = document.querySelectorAll('.toggle-switch-container p');
            cyclePara.forEach(p => { p.classList.remove('selected'); });
            if (this.savedValues.step2.cycle === billingCycle.Monthly) {
                (_a = cyclePara[0]) === null || _a === void 0 ? void 0 : _a.classList.add('selected');
            }
            else
                (_b = cyclePara[1]) === null || _b === void 0 ? void 0 : _b.classList.add('selected');
        };
        this.updatePlanInfo = () => {
            const num = document.querySelectorAll('.plan .num');
            const planSpan = document.querySelectorAll('.plan .plan-span');
            const currentPlanCycle = this.savedValues.step2.cycle;
            let planInfo;
            if (currentPlanCycle && typeof currentPlanCycle === 'string')
                planInfo = billingDetails[currentPlanCycle];
            if (planInfo) {
                const planCycles = [planInfo.arcade, planInfo.advanced, planInfo.pro];
                num.forEach((s, index) => {
                    s.innerHTML = String(planCycles[index]);
                    planSpan[index].innerHTML = planInfo.abbr.short;
                });
            }
        };
        this.checkForActiveAddons = () => {
            const checkBoxes = document.querySelectorAll('.add-on input');
            const checkBoxesDiv = document.querySelectorAll('.add-on');
            const checkBoxesLabel = document.querySelectorAll('.add-on label');
            checkBoxes.forEach((c, i) => {
                var _a;
                c.addEventListener('click', () => {
                    this.addClickEventStep3(checkBoxesDiv, checkBoxes);
                });
                (_a = checkBoxesLabel[i]) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    this.addClickEventStep3(checkBoxesDiv, checkBoxes);
                });
            });
        };
        this.addClickEventStep3 = (checkBoxesDiv, checkBoxes) => {
            checkBoxesDiv.forEach(ch => { ch.classList.remove('active'); });
            const newObj = [];
            checkBoxes.forEach((ch, index) => {
                if (ch.checked) {
                    checkBoxesDiv[index].classList.add('active');
                    const addon = ch.dataset.addon;
                    newObj.push(addon);
                }
            });
            if (typeof this.savedValues.step3.addons === 'object') {
                this.savedValues.step3.addons = newObj;
            }
        };
        this.recallClickedAddons = () => {
            const checkBoxes = document.querySelectorAll('.add-on input');
            const checkBoxesDiv = document.querySelectorAll('.add-on');
            const a = this.savedValues.step3.addons;
            if (typeof a === 'object') {
                a.forEach(addon => {
                    if (addon === 'onlineService') {
                        checkBoxes[0].checked = true;
                    }
                    else if (addon === 'largerStorage') {
                        checkBoxes[1].checked = true;
                    }
                    else if (addon === 'customizableProfile') {
                        checkBoxes[2].checked = true;
                    }
                });
            }
            this.addClickEventStep3(checkBoxesDiv, checkBoxes);
        };
        this.updateAddonPrice = () => {
            var _a, _b, _c;
            const num = document.querySelectorAll('.step-3 .num');
            const length = document.querySelectorAll('.step-3 .length');
            const cycle = this.savedValues.step2.cycle;
            if (cycle && typeof cycle === 'string') {
                num[0].innerHTML = String((_a = billingDetails[cycle]) === null || _a === void 0 ? void 0 : _a.onlineService);
                num[1].innerHTML = String((_b = billingDetails[cycle]) === null || _b === void 0 ? void 0 : _b.largerStorage);
                num[2].innerHTML = String((_c = billingDetails[cycle]) === null || _c === void 0 ? void 0 : _c.customizableProfile);
                length.forEach(s => {
                    var _a, _b;
                    if ((_a = billingDetails[cycle]) === null || _a === void 0 ? void 0 : _a.abbr.short) {
                        s.innerHTML = (_b = billingDetails[cycle]) === null || _b === void 0 ? void 0 : _b.abbr.short;
                    }
                });
            }
        };
        this.updatePaymentSummary = () => {
            var _a, _b;
            const savedCycle = this.savedValues.step2.cycle;
            let billingCycle;
            if (typeof savedCycle === 'string' && billingDetails[savedCycle]) {
                billingCycle = billingDetails[savedCycle];
            }
            const plan = document.querySelector('.step-4 .plan');
            const cycle = document.querySelector('.step-4 .plan-span-full');
            const planPrice = document.querySelector('.step-4 .num');
            const shortCycle = document.querySelectorAll('.step-4 .plan-span');
            const addonsContainer = document.querySelector('.step-4 .addons');
            const selectedTime = document.querySelector('.step-4 .selected-time');
            if (typeof this.savedValues.step2.plan === 'string') {
                plan.innerHTML = ((_a = this.savedValues.step2.plan[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + this.savedValues.step2.plan.slice(1);
                planPrice.innerHTML = String(billingCycle[this.savedValues.step2.plan]);
            }
            if (typeof savedCycle === 'string')
                cycle.innerHTML = ((_b = savedCycle[0]) === null || _b === void 0 ? void 0 : _b.toUpperCase()) + (savedCycle === null || savedCycle === void 0 ? void 0 : savedCycle.slice(1));
            shortCycle.forEach(s => {
                s.innerHTML = billingCycle.abbr.short;
            });
            addonsContainer.innerHTML = this.createAddons()[0].length === 0 ? 'No addons selected' : this.createAddons()[0];
            this.calculateTotalPrice();
            selectedTime.innerHTML = billingCycle.abbr.normal;
        };
        this.createAddons = () => {
            var _a;
            let htmlCode = '';
            let totalAddonPrice = 0;
            if (typeof this.savedValues.step3.addons === 'object')
                (_a = this.savedValues.step3.addons) === null || _a === void 0 ? void 0 : _a.forEach(a => {
                    var _a;
                    const upperCase = [];
                    const lowerCase = [];
                    let foundUpperCase = false;
                    a.split('').forEach(add => {
                        if (this.isUpperCase(add))
                            foundUpperCase = true;
                        if (foundUpperCase)
                            upperCase.push(add.toLowerCase());
                        else
                            lowerCase.push(add.toLowerCase());
                    });
                    let name = lowerCase.join('') + ' ' + upperCase.join('');
                    name = ((_a = name[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + name.slice(1);
                    let cycle;
                    if (typeof this.savedValues.step2.cycle === 'string')
                        cycle = this.savedValues.step2.cycle;
                    const obj = billingDetails[cycle];
                    const addonPrice = String(obj[a]);
                    const abbr = obj === null || obj === void 0 ? void 0 : obj.abbr.short;
                    htmlCode += `
        <div class = "addon">
          <p class = "addon-name">${name}</p>
          <p class = "addon-price">
            +$<span class = "num">${addonPrice}</span>/<span class = "plan-span">${abbr}</span>
          </p>
        </div>
      `;
                    totalAddonPrice += Number(addonPrice);
                });
            return [htmlCode, totalAddonPrice];
        };
        this.isUpperCase = (letter) => {
            const code = letter.charCodeAt(0);
            return code >= 65 && code <= 90;
        };
        this.calculateTotalPrice = () => {
            let totalPrice = 0;
            let cycle;
            if (typeof this.savedValues.step2.cycle === 'string')
                cycle = this.savedValues.step2.cycle;
            const obj = billingDetails[cycle];
            let plan;
            if (typeof this.savedValues.step2.plan === 'string')
                plan = this.savedValues.step2.plan;
            if (obj)
                totalPrice = obj[plan] + this.createAddons()[1];
            document.querySelector('.step-4 .total-num').innerHTML = totalPrice;
        };
        this.addAnchorEvent = () => {
            var _a;
            (_a = document.querySelector('.step-4 a')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                this.switchPages(2);
            });
        };
        this.selectValidNav = () => {
            var _a, _b;
            for (let i = 0; i < this.validPages + 1; i++) {
                (_a = document.querySelector(`.js-step${i}-btn`)) === null || _a === void 0 ? void 0 : _a.classList.remove('invalid');
            }
            if (this.currentStep === 4) {
                this.validPages = 0;
                for (let i = 1; i < 5; i++) {
                    (_b = document.querySelector(`.js-step${i}-btn`)) === null || _b === void 0 ? void 0 : _b.classList.add('invalid');
                }
            }
        };
        this.transition = (dir) => {
            var _a, _b;
            if (dir === 'out') {
                (_a = document.querySelector('.details-container')) === null || _a === void 0 ? void 0 : _a.animate([
                    { opacity: 1 },
                    { opacity: 0 }
                ], {
                    duration: 200,
                    iterations: 1,
                    fill: 'forwards',
                    easing: 'ease-in-out'
                });
            }
            else if (dir === 'in') {
                (_b = document.querySelector('.details-container')) === null || _b === void 0 ? void 0 : _b.animate([
                    { opacity: 0 },
                    { opacity: 1 }
                ], {
                    duration: 200,
                    iterations: 1,
                    fill: 'forwards',
                    easing: 'ease-in'
                });
            }
        };
        this.slideOut = (time, step) => {
            const slidingCon = document.querySelector('.transition-container');
            const det = document.querySelector('.details-container');
            if (time === 'start' && step > 1) {
                this.prevStep = this.currentStep;
                if (slidingCon && det) {
                    slidingCon.innerHTML = det.innerHTML;
                    slidingCon.style.display = "block";
                }
            }
            if (time === 'end' && step > 1) {
                let remove;
                if (step >= this.prevStep) {
                    remove = slidingCon.animate([
                        { transform: "translateX(0)" },
                        { transform: "translateX(-100%)" }
                    ], {
                        duration: 150,
                        easing: "ease",
                        fill: "forwards",
                    });
                }
                else {
                    remove = slidingCon.animate([
                        { transform: "translateX(0)" },
                        { transform: "translateX(100%)" }
                    ], {
                        duration: 150,
                        easing: "ease",
                        fill: "forwards",
                    });
                }
                remove.finished.then(() => {
                    slidingCon.style.display = "none";
                });
            }
        };
        this.constructorCode();
    }
    addActiveStates() {
        if (this.currentStep === 1) {
            const stepOneInputs = document.querySelectorAll('.step-1 input');
            stepOneInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.borderColor = this.colorVariables.p600;
                });
                input.addEventListener('blur', () => {
                    input.style.borderColor = '';
                });
            });
        }
        else if (this.currentStep === 2) {
            this.switchPlansEvent();
            if (this.savedValues.step2.toggleSwitchDir === 'right' || this.savedValues.step2.toggleSwitchDir === 'left')
                this.animateBallMovement(this.savedValues.step2.toggleSwitchDir);
            this.switchCycle();
            this.updatePlanInfo();
        }
        else if (this.currentStep === 3) {
            this.checkForActiveAddons();
        }
        else if (this.currentStep === 4) {
            this.addAnchorEvent();
        }
    }
    getDir(dir, prop, w) {
        let returnValue = '';
        if (dir === 'left') {
            if (prop === 'left') {
                if (w === 'from') {
                    returnValue = '.25rem';
                }
                else
                    returnValue = '.15rem';
            }
            else {
                if (w === 'from') {
                    returnValue = 'unset';
                }
                else
                    returnValue = 'unset';
            }
        }
        else {
            if (prop === 'right') {
                if (w === 'from') {
                    returnValue = '.25rem';
                }
                else
                    returnValue = '.15rem';
            }
            else {
                if (w === 'from') {
                    returnValue = 'unset';
                }
                else
                    returnValue = 'unset';
            }
        }
        return returnValue;
    }
}
new switchBetweenPages();
export {};
//# sourceMappingURL=main.js.map