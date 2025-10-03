enum billingCycle {
  Monthly = "monthly",
  Yearly = "yearly"
}

interface IBillingCycleObj {
  arcade: number,
  advanced: number,
  pro: number,
  onlineService: number,
  largerStorage: number,
  customizableProfile: number,
  abbr: {
    short: string,
    normal: string,
    long: string
  }
}

interface IBillingType {
  [key: string]: IBillingCycleObj
}

const billingDetails: IBillingType = {
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
}

Object.freeze(billingDetails);
Object.freeze(billingDetails[billingCycle.Monthly]);
Object.freeze(billingDetails[billingCycle.Yearly]);

interface IErrorMessage {
  error: boolean,
  errorMessage: string
}

interface ISavedObjectInterface {
  [key: string]: string | string[]
}

interface ISavedValues {
  [key: string]: ISavedObjectInterface
}

class switchBetweenPages {
  step1: HTMLButtonElement = document.querySelector('.js-step1-btn')!;
  step2: HTMLButtonElement = document.querySelector('.js-step2-btn')!;
  step3: HTMLButtonElement = document.querySelector('.js-step3-btn')!;
  step4: HTMLButtonElement = document.querySelector('.js-step4-btn')!;
  stepContainer: HTMLDivElement = document.querySelector('.switch-step')!;
  currentStep: number = 4;
  addOnSelected: string = 'arcade';
  steps: HTMLButtonElement[] = [this.step1, this.step2, this.step3, this.step4];
  allSteps: NodeListOf<HTMLDivElement> = document.querySelectorAll('.step'); 
  colorVariables = {
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
  }
  validPages: number = 1;
  savedValues: ISavedValues = {
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
  }
  prevStep!: number; 

  constructor () {
    this.constructorCode();
  }

  constructorCode = async () => {
    this.addNavEvents();
    await this.switchPages();
    this.checkForActiveAddons();
  }

  stepCode = async (stepToGo: number): Promise<string | undefined> => {
    if (stepToGo !== this.currentStep) {
      if (stepToGo === 1) {
        const f = await this.fetchHTML(1)
        return f;
      } else if (stepToGo === 2) {
        const f = await this.fetchHTML(2).then(response => {
          return response;
        })
        return f;
      } else if (stepToGo === 3) {
        const f = await this.fetchHTML(3).then(response => {
          return response;
        })
        return f;
      } else if (stepToGo === 4) {
        const f = await this.fetchHTML(4).then(response => {
          return response;
        })
        return f;
      } else if (stepToGo === 5) {
        const f = await this.fetchHTML(5).then(response => {
          return response;
        })
        return f;
      }
    }
  }

  fetchHTML = (stepToGo: number) => {
    const f: Promise<string> = fetch(`../build/steps-code/step${stepToGo}.txt`).then(res => {
      return res.text();
    })

    return f;
  }

  switchPages = async (step: number = 1) => {
    // this.transition('out')
      this.slideOut('start', step);
      this.stepContainer.innerHTML = await this.stepCode(step) ?? 'Please refresh page';
      this.updateSavedValues(step);
      this.changeHeaders(step);
      this.currentStep = step;
      this.updatePrevBtn();
      this.updateNextBtn();
      this.changeActiveElement();
      this.addActiveStates();
      // this.transition('in');
      this.slideOut('end', step);
    if (this.currentStep === 5) this.currentStep = 6;
  }

  updateSavedValues = (step: number) => {
    if (step === 1) {
      const stepOneInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.step-1 input');
      const o = this.savedValues.step1;
      if (o) {
        if (o.name && typeof o.name === 'string') stepOneInputs[0]!.value = o.name;
        if (o.email && typeof o.email === 'string') stepOneInputs[1]!.value = o.email;
        if (o.phone && typeof o.phone === 'string') stepOneInputs[2]!.value = o.phone;
      }
    } else if (step === 2) {
      const plans: NodeListOf<HTMLDivElement> = document.querySelectorAll('.plan');
      plans.forEach(p => {
        p.classList.remove('plan-select');
        if (this.savedValues.step2) {
          if (p.dataset.plan === this.savedValues.step2.plan) {
            p.classList.add('plan-select');
          }
        }
      })
    } else if  (step === 3) {
      this.recallClickedAddons();
      this.updateAddonPrice();
    } else if (step === 4) {
      this.updatePaymentSummary();
    }
  }

  switchSteps = (): void => {
    if (this.currentStep === 1) {
      if (this.checkRequiredContents()) {
        this.switchPages(2);
        if (this.validPages <= 2) this.validPages = 2;
      }
    }
    else {
      this.switchPages(this.currentStep + 1);
      if (this.validPages <= this.currentStep + 1)
      this.validPages = this.currentStep + 1;
    }
    this.selectValidNav();
  }

  updatePrevBtn = () => {
    const previousBtn: HTMLAnchorElement | null =  document.querySelector('.previous');
    if (this.currentStep === 1) {
      if (previousBtn)
      previousBtn.style.display = "none";
    } else if (previousBtn) previousBtn.style.display = "block";
  }

  updateNextBtn = () => {
    const nextBtn: HTMLButtonElement = document.querySelector('.action-btns .next')!;
    if (this.currentStep === 4) {
      nextBtn.innerHTML = 'Confirm'
      nextBtn.classList.add('last');
    } else {
      nextBtn.innerHTML = 'Next Step'
      nextBtn.classList.remove('last');
    }
  }

  addNavEvents = (): void => {
    const nextBtn: HTMLButtonElement = document.querySelector('.action-btns .next')!;
    const previousBtn: HTMLAnchorElement | null =  document.querySelector('.previous');
    this.steps.forEach((stepBtn, index) => {
      const step: number = index + 1;
      stepBtn.addEventListener('click', async () => {
        if (this.currentStep !== step && this.validPages >= step && this.currentStep !== 6) {
        this.switchPages(step);
      }
      })
    })
    nextBtn.addEventListener('click', this.switchSteps);
    previousBtn?.addEventListener('click', () => {
      this.switchPages(this.currentStep - 1);
    })
  }

  changeHeaders = (goToStep: number): void => {
    const mainHeader: HTMLHeadingElement | null = document.querySelector('h1');
    const subHeader: HTMLHeadingElement | null = document.querySelector('h4');
    const actionBtns: HTMLButtonElement | null = document.querySelector('.action-btns');
    const display: HTMLDivElement | null = document.querySelector('.details-container');
    if (goToStep === 1) {
      if (mainHeader) 
      mainHeader.innerHTML = 'Personal Info';
      if (subHeader)
        subHeader.innerHTML = 'Please provide your name, email address, and phone number.'
    } else if (goToStep === 2) {
      if (mainHeader) 
        mainHeader.innerHTML = 'Select your plan';
      if (subHeader)
        subHeader.innerHTML = 'You have the option of monthly or yearly billing.'
    } else if (goToStep === 3) {
      if (mainHeader) 
        mainHeader.innerHTML = 'Pick add-ons';
      if (subHeader)
        subHeader.innerHTML = 'Add-ons help enhance your gaming experience.'
    } else if (goToStep === 4) {
      if (mainHeader) 
        mainHeader.innerHTML = 'Finishing up';
      if (subHeader)
        subHeader.innerHTML = 'Double-check everything looks OK before continuing.'
    } else if (goToStep === 5) {
      mainHeader!.style.display = "none";
      subHeader!.style.display = "none";
      actionBtns!.style.display = "none";
      display?.classList.add('center');
    }
  }

  changeActiveElement = (): void => {
        this.allSteps.forEach(step => {
          step.classList.remove('active');
        })
        this.allSteps[this.currentStep - 1]?.classList.add('active');
  }

  addActiveStates(): void {
    if (this.currentStep === 1) {
      const stepOneInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.step-1 input');

      stepOneInputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.style.borderColor = this.colorVariables.p600;
        })
        input.addEventListener('blur', () => {
          input.style.borderColor = '';
        })
      })
    } else if (this.currentStep === 2) {
      this.switchPlansEvent();
      if (this.savedValues.step2!.toggleSwitchDir === 'right' || this.savedValues.step2!.toggleSwitchDir === 'left')
      this.animateBallMovement(this.savedValues.step2!.toggleSwitchDir);
      this.switchCycle();
      this.updatePlanInfo();
    } else if (this.currentStep === 3) {
      this.checkForActiveAddons();
    } else if (this.currentStep === 4) {
      this.addAnchorEvent();
    }
  }

  checkRequiredContents = (): boolean => {
    let noError: boolean = true;
    interface Error {
      [key: string]: IErrorMessage
    }

    const stepOneInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.step-1 input');
    const stepOneLabels: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('.step-1 label .error-message')!;
    const validation: Error = {};
    const allAlphabet: RegExp = /^[A-Za-z\s]+$/;
    const emailVerification: RegExp = 
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const numberVerification: RegExp = /^\+?[\d\s]+$/;

    type notFilledObj = {
      [key: string]: boolean
    }

    const notFilled: notFilledObj = {
      0: false,
      1: false,
      2: false
    };

    let allFilled = true;

    stepOneInputs.forEach((input,index) => {
      if (input.value.length > 0) {
        notFilled[index] = true;
      }
    })

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
          })
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
          }
        }

      if (stepOneInputs[1])
        if (emailVerification.test(stepOneInputs[1].value))
           validation.email = {
            error: false,
            errorMessage: ''
          } 
        else {
          validation.email = {
            error: true,
            errorMessage: 'This email is not valid'
          }
        }
          

      if (stepOneInputs[2])
        if (numberVerification.test(stepOneInputs[2].value))
          validation.phone = this.checkForError('phone', stepOneInputs[2].value);
        else {
          validation.phone = {
            error: true,
            errorMessage: 'This number is not valid'
          }
        }

      for (let err in validation) {
        if (validation[err]?.error) {
          noError = false;
          const elem: HTMLInputElement | null = document.querySelector(`.js-${err}`); 
          const p: HTMLLabelElement | null = document.querySelector(`.js-label-${err} .error-message`);
          if (elem)
          elem.style.borderColor = this.colorVariables.r500;
          if (p)
          p.innerHTML = validation[err].errorMessage;
          elem?.addEventListener('input', () => {
            if (p)
            p.innerHTML = '';
            elem.style.borderColor = '';
          })
        }
      }
    }
    if (noError) {
      if (this.savedValues.step1) {
        this.savedValues.step1.name = stepOneInputs[0]!.value;
        this.savedValues.step1.email = stepOneInputs[1]!.value;
        this.savedValues.step1.phone = stepOneInputs[2]!.value;
      }
      
    }
    return noError;
  }

  checkForError = (type: string, value: string): IErrorMessage => {
    const returnValue: IErrorMessage = {
      error: false,
      errorMessage: ''
    }
    if (type === 'name') {
      const spl: string[] = value.split(' ');
      const validSpl: string[] = spl.filter(w => w.length !== 0);

      if (validSpl.length === 1) {
        returnValue.error = true; 
        returnValue.errorMessage = 'Please enter your full name (first and last)';
      } else if (validSpl.length > 3) {
        returnValue.error = true; 
        returnValue.errorMessage = 'Please enter only TWO or THREE names';
      }
    } else if (type === 'phone') {
      let modifiedValue: string = value;
      if (value.includes(' ')) {
        const spl = value.split(' ');
        modifiedValue = '';
        spl.forEach(c => {
          modifiedValue += c;
        })
      }
      if (modifiedValue.includes('+'))  {
        const spl = modifiedValue.split('');
        modifiedValue = spl.filter(c => c !== '+').join('')
      }

      if (modifiedValue.length < 7) {
        returnValue.error = true;
        returnValue.errorMessage = 'Please enter at least 7 digits.';
      }
    }

    return returnValue;
  }

  switchPlansEvent = () => {
    const plans: NodeListOf<HTMLDivElement> = document.querySelectorAll('.plan');
    plans.forEach((plan, index) => {
      const planTitle: string = plan.dataset.plan!;
      plan.addEventListener('click', () => {
        plans.forEach(p => { p.classList.remove('plan-select') })
        plan.classList.add('plan-select');
        if (this.savedValues.step2?.plan)
        this.savedValues.step2.plan = planTitle;
      })
    })
    this.toggleCycle();
  }

  toggleCycle = () => {
    const cycleSwitch: HTMLDivElement = document.querySelector('.toggle-switch')!;
    const cycleBall: HTMLDivElement = document.querySelector('.toggle-ball')!;

    cycleSwitch.addEventListener('mouseenter', () => {
      this.animateBallMovement('increase')
    })
    cycleSwitch.addEventListener('mouseleave', () => {
      this.animateBallMovement('decrease')
    })
    cycleSwitch.addEventListener('click', () => {
      let currentCycle!: string
      if (typeof this.savedValues.step2!.cycle === 'string')
      currentCycle = this.savedValues.step2!.cycle!;
      if (currentCycle === billingCycle.Monthly) {
        this.savedValues.step2!.cycle = billingCycle.Yearly;
        this.animateBallMovement('right')
      } else {
        this.savedValues.step2!.cycle = billingCycle.Monthly;
        this.animateBallMovement('left')
      }

      this.switchCycle();
      this.updatePlanInfo();
    })
  }

  animateBallMovement = (direction: 'right' | 'left' | 'increase' | 'decrease' | 'show') => {
    const cycleBall: HTMLDivElement = document.querySelector('.toggle-ball')!;
    let leftValue: string = '.25';
    let rightValue: string = 'unset';
    const unit = 'rem';
    let dir!: string;
    if (this.savedValues.step2!.toggleSwitchDir && typeof this.savedValues.step2!.toggleSwitchDir === 'string') dir = this.savedValues.step2!.toggleSwitchDir;
    
    if (direction === 'right') {
      leftValue = 'unset';
      rightValue = '.25';
      this.savedValues.step2!.toggleSwitchDir = 'right';
      cycleBall.animate([
        {
          left: rightValue + unit,
          right: leftValue
        },
        {
          left: leftValue,
          right: rightValue + unit
        }
      ],
      {
        duration: 150,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
      )
    } else if (direction === 'left') {
      leftValue = '.25';
      rightValue = 'unset';
      this.savedValues.step2!.toggleSwitchDir = 'left';
      cycleBall.animate([
        {
          left: rightValue ,
          right: leftValue + unit
        },
        {
          left: leftValue + unit,
          right: rightValue
        }
      ],
      {
        duration: 150,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
      )
    } else if (direction === 'increase') {
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
      ],
      {
        duration: 150,
        iterations: 1,
        fill: "forwards",
        easing: "ease-in-out"
      }
      );
    } else if (direction === 'decrease') {
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
      ],
      {
        duration: 150,
        iterations: 1,
        fill: "forwards",
        easing: "ease-in-out"
      }
      );
    }
  }

  getDir(dir: string, prop: 'left' | 'right', w: 'from' | 'to'): string {
      let returnValue: string = ''
      if (dir === 'left') {
        if (prop === 'left') {
          if (w === 'from') {
          returnValue = '.25rem'
          } else returnValue = '.15rem'
        } else {
          if (w === 'from') {
          returnValue = 'unset'
          } else returnValue = 'unset'
        }
      } else {
        if (prop === 'right') {
          if (w === 'from') {
          returnValue = '.25rem'
          } else returnValue = '.15rem'
        } else {
          if (w === 'from') {
          returnValue = 'unset'
          } else returnValue = 'unset'
        }
      }
      return returnValue;
    }

  switchCycle = () => {
    const cyclePara: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('.toggle-switch-container p');
    cyclePara.forEach(p => {p.classList.remove('selected')})
    if (this.savedValues.step2!.cycle === billingCycle.Monthly) {
      cyclePara[0]?.classList.add('selected')
    } else cyclePara[1]?.classList.add('selected')
  }

  updatePlanInfo = () => {
    const num: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.plan .num');
    const planSpan: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.plan .plan-span');
    const currentPlanCycle = this.savedValues.step2!.cycle;

    let planInfo!: IBillingCycleObj;
    if (currentPlanCycle && typeof currentPlanCycle === 'string')
    planInfo = billingDetails[currentPlanCycle]!;

    if (planInfo) {
      const planCycles = [planInfo.arcade, planInfo.advanced, planInfo.pro];

      num.forEach((s, index) => {
        s!.innerHTML = String(planCycles[index])
        planSpan[index]!.innerHTML = planInfo.abbr.short;
      })
    }
  }

  checkForActiveAddons = () => {
    const checkBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('.add-on input');
    const checkBoxesDiv: NodeListOf<HTMLDivElement> = document.querySelectorAll('.add-on');
    const checkBoxesLabel: NodeListOf<HTMLLabelElement> = document.querySelectorAll('.add-on label');
    checkBoxes.forEach((c, i) => {
      c.addEventListener('click', () => {
        this.addClickEventStep3(checkBoxesDiv, checkBoxes);
      })
      checkBoxesLabel[i]?.addEventListener('click', () => {
        this.addClickEventStep3(checkBoxesDiv, checkBoxes)
      })
    })
  }

  addClickEventStep3 = (checkBoxesDiv: NodeListOf<HTMLDivElement>, checkBoxes: NodeListOf<HTMLInputElement>) => {
    checkBoxesDiv.forEach(ch => { ch.classList.remove('active') });
    const newObj: string[] = [];
    checkBoxes.forEach((ch, index) => {
      if (ch.checked) {
        checkBoxesDiv[index]!.classList.add('active');
        const addon: string = ch.dataset.addon!;
        newObj.push(addon);
      } 
    });
    if (typeof this.savedValues.step3!.addons! === 'object') {
      this.savedValues.step3!.addons! = newObj;
    }
  }

  recallClickedAddons = () => {
    const checkBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('.add-on input');
    const checkBoxesDiv: NodeListOf<HTMLDivElement> = document.querySelectorAll('.add-on');
    const a = this.savedValues!.step3!.addons;
    if (typeof a === 'object') {
      a.forEach(addon => {
        if (addon === 'onlineService') {
          checkBoxes[0]!.checked = true;
        } else if (addon === 'largerStorage') {
          checkBoxes[1]!.checked = true;
        } else if (addon === 'customizableProfile') {
          checkBoxes[2]!.checked = true;
        }
      })
    } 
    this.addClickEventStep3(checkBoxesDiv, checkBoxes);
  }

  updateAddonPrice = () => {
    const num: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.step-3 .num');
    const length: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.step-3 .length');
    const cycle = this.savedValues.step2!.cycle;
    if (cycle && typeof cycle === 'string') {
      num[0]!.innerHTML = String(billingDetails[cycle]?.onlineService);
      num[1]!.innerHTML = String(billingDetails[cycle]?.largerStorage);
      num[2]!.innerHTML = String(billingDetails[cycle]?.customizableProfile);

      
        length.forEach(s => {
          if (billingDetails[cycle]?.abbr.short){
           s.innerHTML = billingDetails[cycle]?.abbr.short 
          }
        })
      
    }
    
  }

  updatePaymentSummary = () => {
    const savedCycle = this.savedValues!.step2!.cycle;
    let billingCycle!: IBillingCycleObj;
    if (typeof savedCycle === 'string' && billingDetails[savedCycle]) {
      billingCycle = billingDetails[savedCycle]
    }

    const plan: HTMLSpanElement = document.querySelector('.step-4 .plan')!;
    const cycle: HTMLSpanElement = document.querySelector('.step-4 .plan-span-full')!;
    const planPrice: HTMLSpanElement = document.querySelector('.step-4 .num')!;
    const shortCycle: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.step-4 .plan-span')!;
    const addonsContainer: HTMLDivElement = document.querySelector('.step-4 .addons')!;
    const selectedTime: HTMLSpanElement = document.querySelector('.step-4 .selected-time')!;

    if (typeof this.savedValues!.step2!.plan === 'string') {
      plan.innerHTML = this.savedValues!.step2!.plan[0]?.toUpperCase() + this.savedValues!.step2!.plan.slice(1);

      planPrice.innerHTML = String(billingCycle[this.savedValues!.step2!.plan as keyof IBillingCycleObj])
    }
    
    if (typeof savedCycle === 'string')
    cycle.innerHTML = savedCycle[0]?.toUpperCase() + savedCycle?.slice(1);

    shortCycle.forEach(s => {
      s.innerHTML = billingCycle.abbr.short;
    })

    addonsContainer.innerHTML = this.createAddons()[0].length === 0 ? 'No addons selected' : this.createAddons()[0];
    this.calculateTotalPrice();

    selectedTime.innerHTML = billingCycle.abbr.normal;
  }

  createAddons = (): [string, any] => {
    let htmlCode: string = '';
    let totalAddonPrice = 0;
    if (typeof this.savedValues!.step3!.addons === 'object')
    this.savedValues!.step3!.addons?.forEach(a => {
      const upperCase: string[] = [];
      const lowerCase: string[] = [];
      let foundUpperCase = false;
      a.split('').forEach(add => {
        if (this.isUpperCase(add)) foundUpperCase = true;
        if (foundUpperCase) upperCase.push(add.toLowerCase())
        else lowerCase.push(add.toLowerCase());
      })
      let name = lowerCase.join('') + ' ' + upperCase.join('')
      name = name[0]?.toUpperCase() + name.slice(1);
      let cycle!: string;
      if (typeof this.savedValues.step2!.cycle === 'string')
      cycle = this.savedValues.step2!.cycle

      const obj = billingDetails[cycle];
      const addonPrice = String(obj![a as keyof IBillingCycleObj]);
      const abbr = obj?.abbr.short

      htmlCode += `
        <div class = "addon">
          <p class = "addon-name">${name}</p>
          <p class = "addon-price">
            +$<span class = "num">${addonPrice}</span>/<span class = "plan-span">${abbr}</span>
          </p>
        </div>
      `;
      totalAddonPrice += Number(addonPrice);
    })
    return [htmlCode, totalAddonPrice];
  }

  isUpperCase = (letter: string): boolean => {
    const code = letter.charCodeAt(0);
    return code >= 65 && code <= 90
  }

  calculateTotalPrice = () => {
    let totalPrice: any = 0
    let cycle!: string;
    if (typeof this.savedValues!.step2!.cycle === 'string') 
    cycle = this.savedValues!.step2!.cycle;
    const obj = billingDetails[cycle];
    let plan!: string;
    if (typeof this.savedValues!.step2!.plan === 'string')
    plan = this.savedValues!.step2!.plan

    if (obj)
    totalPrice = obj[plan as keyof IBillingCycleObj] + this.createAddons()[1];

    document.querySelector('.step-4 .total-num')!.innerHTML = totalPrice;
  }

  addAnchorEvent = () => {
    document.querySelector('.step-4 a')?.addEventListener('click', () => {
      this.switchPages(2);
    })
  }

  selectValidNav = () => {
    for (let i = 0; i < this.validPages + 1; i++) {
      document.querySelector(`.js-step${i}-btn`)?.classList.remove('invalid');
    }
    if (this.currentStep === 4) {
      this.validPages = 0;
      for (let i = 1; i < 5; i++) {
      document.querySelector(`.js-step${i}-btn`)?.classList.add('invalid');
    }
    }
  }

  transition = (dir: string) => {
    if (dir === 'out') {
      document.querySelector('.details-container')?.animate(
      [
        { opacity: 1 },
        { opacity: 0 }
      ],
      {
        duration: 200,
        iterations: 1,
        fill: 'forwards',
        easing: 'ease-in-out'
      }
    );
    } else if (dir === 'in') {
      document.querySelector('.details-container')?.animate(
      [
        { opacity: 0 },
        { opacity: 1 }
      ],
      {
        duration: 200,
        iterations: 1,
        fill: 'forwards',
        easing: 'ease-in'
      }
    );
    }
  }

  slideOut = (time: string, step: number) => {
    const slidingCon: HTMLDivElement | null = document.querySelector('.transition-container');
    const det: HTMLDivElement | null = document.querySelector('.details-container');
    console.log(step, this.prevStep);

    if (time === 'start' && step > 1) {
      this.prevStep = this.currentStep;
      if (slidingCon && det) {
        slidingCon.innerHTML = det.innerHTML;
        slidingCon.style.display = "block";
      }
    } if (time === 'end' && step > 1) {
      let remove!: Animation;
      if (step >= this.prevStep) {
        remove = slidingCon!.animate([
          { transform: "translateX(0)" },
          { transform: "translateX(-100%)" }
        ],
        {
          duration: 150,
          easing: "ease",
          fill: "forwards",
        }
        )
      }
      else  {
        remove = slidingCon!.animate([
        { transform: "translateX(0)" },
        { transform: "translateX(100%)" }
      ],
      {
        duration: 150,
        easing: "ease",
        fill: "forwards",
      }
      )
      }
      remove.finished.then(() => {
        slidingCon!.style.display = "none";
      })
    }
  }
}

new switchBetweenPages();