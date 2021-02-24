// ===================================== //
// ============= VARIABLES ============= //
// ===================================== //
// Main variable
const calculator = document.querySelector(".calculator");

// Display
const preResultDisplay = calculator.querySelector("#pre-result");
const resultDisplay = calculator.querySelector("#result");

// Specials
const buttonAC = calculator.querySelector("#btn-ac");
const buttonCE = calculator.querySelector("#btn-ce");
const buttonInvert = calculator.querySelector("#btn-invert");
const buttonDecimal = calculator.querySelector("#btn-decimal");
const buttonEquals = calculator.querySelector("#btn-equals");

// Operators
const buttonSum = calculator.querySelector("#btn-sum");
const buttonSubstract = calculator.querySelector("#btn-substract");
const buttonMultiply = calculator.querySelector("#btn-multiply");
const buttonDivide = calculator.querySelector("#btn-divide");

// Numbers
const numbers = [];
const MAX_INPUT_NUMBERS = 15;

// Misc variables
let resultDisplayLength = 0;
let savedNumber = 0;
let savedSymbol = "";
let negativeOperation = false;
let floatOperation = false;
let isNewOperation = true;

// ===================================== //
// ============= FUNCTIONS ============= //
// ===================================== //

/*  This function clears every variable.
    Usage with "option" parameter:
        - 0 = only floatOperation
        - 1 = only isNewOperation
        - 2 = both
*/
const clearVars = (option) => {

    if (negativeOperation) {
        negativeOperation = false;
    }

    switch (option) {

        case 0:
            if (floatOperation) {
                floatOperation = false;
            }

            break;

        case 1:
            if (!isNewOperation) {
                isNewOperation = true;
            }

            break;
        
        case 2:
            if (floatOperation) {
                floatOperation = false;
            }

            if (!isNewOperation) {
                isNewOperation = true;
            }

            break;
    }
};

// This function sets all the numbers (0-9) in the numbers array.
const createNumbers = () => {

    for (let i = 0; i < 10; i++) {
        
        numbers.push(calculator.querySelector(`#btn-${i}`));

        numbers[i].addEventListener("click", insertNumber);
    }
};

// This function adds the number to the display.
const insertNumber = (element) => {

    if (resultDisplayLength > MAX_INPUT_NUMBERS - 1) {
        alert("You cannot add more numbers.");
        return;
    }

    resultDisplay.textContent += element.target.textContent;

    resultDisplayLength++;
};

// This function clears the display.
const clearDisplay = () => {
        
    resultDisplay.textContent = "";
    preResultDisplay.textContent = "";
    
    resultDisplayLength = 0;

    savedNumber = 0;
    savedSymbol = "";

    clearVars(2);
};

// This function adds the number to the display.
const removeNumber = () => {

    if (resultDisplayLength === 0) {
        return;
    }
    
    if (resultDisplay.textContent[resultDisplayLength - 1] === ".") {
        floatOperation = false;
    }
    
    resultDisplay.textContent = resultDisplay.textContent.slice(0, resultDisplayLength - 1);
    
    resultDisplayLength--;

    if (resultDisplayLength === 1) {

        clearVars(1);
    }
};

// This function inverts the number.
const invertNumber = () => {

    if (resultDisplayLength === 0) {
        alert("There's no number to invert.");
        return;
    }

    if (resultDisplayLength > MAX_INPUT_NUMBERS) {
        alert("You cannot add a decimal because you've reached the limit.");
        return;
    }

    resultDisplay.textContent = (!negativeOperation) ? 
                                ("-" + resultDisplay.textContent) : resultDisplay.textContent.slice(1);

    negativeOperation = !negativeOperation;
};

// This function inserts the decimal dot for decimal operations.
const insertDecimal = () => {

    if (resultDisplayLength === 0 || floatOperation) {
        return;
    }

    if (resultDisplayLength > (MAX_INPUT_NUMBERS - 1)) {
        alert("You cannot add a decimal because you've reached the limit.");
        return;
    }

    resultDisplay.textContent += ".";
    floatOperation = true;
};

// This function parses the display's number checking if it's a floating number or not.
const parseNumber = () => {
    return (floatOperation) ? parseFloat(resultDisplay.textContent) : parseInt(resultDisplay.textContent);
};

// This function will stop the operations if the display reaches the characters limit.
const cancelIfMaxChars = () => {

    alert("This operation will be cancelled because it goes out of bounds.");

    clearDisplay();

    return;
};

// This function will operate using the saved number and symbol, with the new number passed.
// After it makes the operation, it will verify if the result reaches the characters limit.
const getResult = (newNumber) => {

    console.log("#1 ( + savedNumber).length = " + (("" + savedNumber).length));

    switch (savedSymbol) {

        case "+":
            savedNumber += newNumber;
            break;

        case "-":
            savedNumber -= newNumber;
            break;

        case "*":
            savedNumber *= newNumber;
            break;

        case "/":
            if (newNumber === 0 || newNumber === 0.0) {
                alert("You cannot divide by zero.");
                return false;
            }

            savedNumber /= newNumber;
            break;
    }

    console.log("savedNumber = " + savedNumber);
    console.log("#2 ( + savedNumber).length = " + (("" + savedNumber).length));

    if (("" + savedNumber).length > MAX_INPUT_NUMBERS) {

        cancelIfMaxChars();
        return false;
    }

    return true;
};

// This function starts the operations verifying if there was an input before or not.
const startOperation = (element) => {

    if (preResultDisplay.textContent.length === 0 && resultDisplayLength === 0) {
        return;
    }

    // Este es el elemento que trae el botón (+, -, * o /)
    let actualSymbol = element.target.textContent;

    let parsedNumber = parseNumber();

    if (isNewOperation) {

        savedNumber = parsedNumber;
        
        savedSymbol = actualSymbol;

        preResultDisplay.textContent = `${savedNumber} ${actualSymbol}`;

        resultDisplay.textContent = "";
        resultDisplayLength = 0;

        isNewOperation = false;
    }
    else {

        if (resultDisplayLength === 0) {

            if (actualSymbol === savedSymbol) {
                return;
            }
            
            savedSymbol = actualSymbol;

            preResultDisplay.textContent = `${savedNumber} ${actualSymbol}`;
            return;
        }

        let newNumber = parsedNumber;

        if (getResult(newNumber)) {

            preResultDisplay.textContent = `${savedNumber} ${actualSymbol}`;

            resultDisplay.textContent = "";
            resultDisplayLength = 0;

            savedSymbol = actualSymbol;
        }        
    }

    clearVars(0);
};

// This function finishes the operations, showing the final result.
const finishOperation = () => {

    if (preResultDisplay.textContent.length !== 0) {

        if (resultDisplayLength !== 0) {

            let parsedNumber = parseNumber();

            getResult(parsedNumber);
        }

        resultDisplay.textContent = savedNumber;
        resultDisplayLength = resultDisplay.textContent.length;

        preResultDisplay.textContent = "";

        savedNumber = 0;
        savedSymbol = "";

        clearVars(2);
    }
};

// This function creates all the special functions events (invert, clear, etc).
const createSpecialEvents = () => {

    // Clear the display
    buttonAC.addEventListener("click", clearDisplay);

    // Delete last number
    buttonCE.addEventListener("click", removeNumber);

    // Invert the actual number
    buttonInvert.addEventListener("click", invertNumber);

    // Insert a decimal dot
    buttonDecimal.addEventListener("click", insertDecimal);

    // Finish the operations
    buttonEquals.addEventListener("click", finishOperation);

    // Sum a number
    buttonSum.addEventListener("click", startOperation);

    // Substract a number
    buttonSubstract.addEventListener("click", startOperation);

    // Multiply a number
    buttonMultiply.addEventListener("click", startOperation);

    // Divide a number
    buttonDivide.addEventListener("click", startOperation);
};

// ================================== //
// ============= EVENTS ============= //
// ================================== //

window.onload = () => {

    createNumbers();
    createSpecialEvents();
};