"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".tip-calculator__form");

  // allInputError is a just-in-case
  const allInputError = document.querySelectorAll(".error-msg");
  const billError = document.getElementById("bill-error");
  const peopleError = document.getElementById("people-error");

  const billInput = document.getElementById("bill-input");
  const peopleInput = document.getElementById("people-input");
  const customTipInput = document.getElementById("custom-tip");

  const tipOptions = document.querySelector(".tip-calculator__tip-options");
  const tipButtons = document.querySelectorAll("[data-tip]");

  const tipPerPerson = document.querySelector("#tipPerPerson .tip__amount");
  const totalPerPerson = document.querySelector("#totalPerPerson .tip__amount");

  const resetBtn = document.querySelector(".tip-calculator__reset");

  /* 
  Here i created myself a step-by-step guideline before starting the coding to help organize my thoughts

    Step 1:Throw an error first for good practice so we are starting with form validations here. Try to use the constraint validation api ✅

    and place our functions at the top for re-usability
    ---------------------------------------------------------------
    step 2: we want it to check both input event listener ✅

    step 3: we want to listen to the clicks on each of our button (use event delegation) and make conditions for each tips> 5%, 10% etc. for calculation.✅

    step 4: And if no button is clicked, we listen for input in the custom input, then calculate our tip amount per person & total per person based on the custom input percentage instead of our buttons.✅

    step 5: We want to have a reset btn to reset all of our inputs back to 0 or nothing and also the tip amount/total per person

    we want use everything we've learned so refactoring is +++
    we also have to search for the formula here
  */

  // This here is our throw error form validation

  const getValidationError = (input) => {
    const errors = {
      valueMissing: "This field is required.",
      rangeUnderflow:
        input.id === "bill-input"
          ? "Bill must be at least 1."
          : "Can't be zero",
      patternMismatch: "Only numbers are allowed.",
    };

    for (const errorType in errors) {
      if (input.validity[errorType]) {
        return errors[errorType];
      }
    }

    return "";
  };

  // our event handler that we pass in as a callback
  const validateInputs = () => {
    let isValid = true;

    // Validate Bill
    const billErrorText = getValidationError(billInput);

    if (billErrorText) {
      billError.textContent = billErrorText;

      isValid = false;
    } else {
      billError.textContent = "";
    }

    // Validate People
    const peopleErrorText = getValidationError(peopleInput);
    if (peopleErrorText) {
      peopleError.textContent = peopleErrorText;

      isValid = false;
    } else {
      peopleError.textContent = "";
    }

    return isValid;
  };

  // Function to calculate tip
  // Utility: Calculate and update UI
  const calculateTip = (percentage) => {
    const bill = parseFloat(billInput.value);
    const people = parseInt(peopleInput.value);

    // checks our input if its valid
    if (!isNaN(bill) && bill > 0 && !isNaN(people) && people > 0) {
      const tipAmount = (bill * (percentage / 100)) / people;
      const totalAmount = (bill + bill * (percentage / 100)) / people;

      tipPerPerson.textContent = tipAmount.toFixed(2);
      totalPerPerson.textContent = totalAmount.toFixed(2);
    }
  };

  const resetCalculator = () => {
    // Clear all inputs
    if (!resetBtn.disabled) {
      billInput.value = "";
      peopleInput.value = "";
      customTipInput.value = "";
      // Reset displayed amounts
      tipPerPerson.textContent = "0.00";
      totalPerPerson.textContent = "0.00";
      // Remove errors and styles
      billError.textContent = "";
      peopleError.textContent = "";

      // Disable reset button (optional)
      resetBtn.disabled = true;
    }
  };
  // ^end of step 1

  form.addEventListener("input", (e) => {
    // check if we have inputs to enable our resetBtn
    const hasValues =
      billInput.value || peopleInput.value || customTipInput.value;
    resetBtn.disabled = !hasValues;

    // target variable
    const target = e.target;

    if (target.id === "bill-input" || target.id === "people-input") {
      validateInputs();
    }
  });

  // ^end of step 2

  tipOptions.addEventListener("click", (e) => {
    const clicked = e.target;

    if (clicked.matches("[data-tip]")) {
      const tipPercent = parseFloat(clicked.dataset.tip);
      calculateTip(tipPercent);
    }
  });

  // ^end of step 3

  customTipInput.addEventListener("input", () => {
    const customTip = parseFloat(customTipInput.value);
    if (customTip > 0) {
      calculateTip(customTip);
    }
  });

  // ^end of step 4

  resetBtn.addEventListener("click", resetCalculator);

  // final step our reset button ^
});
