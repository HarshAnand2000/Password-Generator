"use strict";

const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("[data-passwordLength]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".indicator");
const generateBtn = document.querySelector(".generate");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

const allSymbols = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/\\`~";

//intial conditions
let password = "";
let passwordLength = 10;
let checkedCount = 1;
uppercaseCheck.checked = true; //first checkbox is checked intitally
handleSlider();

//sets password length
//this function reflects the passwordLength to the UI
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;

  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

const getRandomIntegerBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //max is exclusive
};

const generateNumber = function () {
  return getRandomIntegerBetween(0, 9);
};

const generateLowerCase = function () {
  return String.fromCharCode(getRandomIntegerBetween(97, 123));
};

const generateUpperCase = function () {
  return String.fromCharCode(getRandomIntegerBetween(65, 91));
};

const generateSymbol = function () {
  const randomSymbolIndex = getRandomIntegerBetween(0, allSymbols.length);
  return allSymbols.charAt(randomSymbolIndex);
};

const setIndicator = function (strengthColorClass) {
  indicator.classList.remove("indicator-normal");
  indicator.classList.remove("indicator-red");
  indicator.classList.remove("indicator-yellow");
  indicator.classList.remove("indicator-green");
  indicator.classList.add(strengthColorClass);
};

const calcStrength = function () {
  let hasUppercase = false;
  let hasLowercase = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUppercase = true;
  if (lowercaseCheck.checked) hasLowercase = true;
  if (numberCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (
    hasUppercase &&
    hasLowercase &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 8
  ) {
    //green strong
    setIndicator("indicator-green");
  } else if (
    (hasUppercase || hasLowercase) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    //yellow mild
    setIndicator("indicator-yellow");
  } else {
    //red weak
    setIndicator("indicator-red");
  }
};

inputSlider.addEventListener("input", function (e) {
  passwordLength = e.target.value;
  // lengthDisplay.innerText = passwordLength;
  handleSlider();
});

//counting number of checkbox checked
const handleCheckboxChange = function () {
  checkedCount = 0;
  allCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedCount++;
    }
  });

  //special condition
  if (passwordLength < checkedCount) {
    passwordLength = checkedCount;
    handleSlider();
  }
};

allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("input", () => {
    handleCheckboxChange();
  });
});

generateBtn.addEventListener("click", function () {
  //resetting the password
  password = "";

  if (checkedCount <= 0) {
    document.querySelector(".oops").classList.add("oops-active");
    setTimeout(function () {
      document.querySelector(".oops").classList.remove("oops-active");
    }, 2000);

    return;
  }

  if (passwordLength < checkedCount) {
    passwordLength = checkedCount;
    handleSlider();
  }

  let functionArray = [];

  if (uppercaseCheck.checked) {
    password += generateUpperCase();
    functionArray.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    password += generateLowerCase();
    functionArray.push(generateLowerCase);
  }
  if (numberCheck.checked) {
    password += generateNumber();
    functionArray.push(generateNumber);
  }
  if (symbolsCheck.checked) {
    password += generateSymbol();
    functionArray.push(generateSymbol);
  }

  //remaining addition
  for (let i = 0; i < passwordLength - checkedCount; i++) {
    let randomIndex = getRandomIntegerBetween(0, functionArray.length);
    password += functionArray[randomIndex]();
  }

  //shuffling the password
  password = shufflePassword(Array.from(password)); //returns string
  passwordDisplay.value = password;

  calcStrength();
});

function shufflePassword(array) {
  //Fishe Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // const temp = array[i];
    // array[i] = array[j];
    // array[j] = temp;
    [array[i], array[j]] = [array[j], array[i]];
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

copyBtn.addEventListener("click", function () {
  if (passwordDisplay.value) {
    copyPassword();
  }
});

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(password);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy waala span visible
  copyMsg.classList.add("copyMsg-active");
  //to make copy waala span invisible
  setTimeout(() => {
    copyMsg.classList.remove("copyMsg-active");
  }, 1000);
}
