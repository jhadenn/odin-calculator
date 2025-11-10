function add(num1, num2){ 
    return num1 + num2;
}

function subtract(num1, num2){
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2){
    return num2 === 0 ? 'Error' : num1/ num2;
}

function operate(operator, num1, num2){
    return operator(num1, num2);
}


function appendToDisplay(value){
    if(shouldResetDisplay){
        display.value = '';
        shouldResetDisplay = false;
    }

    if(value === '.' && display.value.includes('.')) return;
    display.value += value;
}

function getDisplayNumber(){
    return parseFloat(display.value);
}

function clearCalculator(){
    display.value = '';
    firstOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
}

function backspace(){
    if(shouldResetDisplay) return; 
    display.value = display.value.slice(0, -1);
}

function evaluate() {
    if(currentOperator === null || shouldResetDisplay) {
        return; // nothing to do, user pressed = too early
    }

    const secondOperand = getDisplayNumber();
    const result = runOperation(currentOperator, firstOperand, secondOperand);
    displayResult(result);

    // prepare for next calculation
    firstOperand = typeof result === 'number' ? result : null;
    shouldResetDisplay = true;
}

function runOperation(opSymbol, num1, num2) {
    switch(opSymbol) {
        case '+':
            return operate(add, num1, num2);
        case '-':
            return operate(subtract, num1, num2);
        case '×':
           return operate(multiply, num1, num2);
        case '÷':
            return operate(divide,num1,num2);
        default:
            return num2;
    }
}

function displayResult(result){
    if(typeof result === 'number'){
        // round to 3 decimals to avoid overflow
        result = Math.round(result * 1000) / 1000
        display.value = result;
    } else {
        display.value = result;
    }
}

function setOperator(opSymbol){
    // if user presses operator twice in a row, just change the operator, don't evalute
    if (currentOperator !== null && shouldResetDisplay) {
        currentOperator = opSymbol;
        return;
    }

    const currentNumber = getDisplayNumber();

    // first time picking an operator
    if(firstOperand === null) {
        firstOperand = currentNumber;
    } else {
        // we already had a first operand and operator, so evaluate with the new number
        const result = runOperation(currentOperator, firstOperand, currentNumber)
        displayResult(result);
        firstOperand = typeof result === 'number' ? result : null;
    }

    currentOperator = opSymbol;
    shouldResetDisplay = true; // so next digit clears display
}

function handleButtonClick(button){
    const value = button.textContent;

    // clear
    if(button.classList.contains('clear')) {
        clearCalculator();
        return;
    }

    if(button.classList.contains('delete')){
        backspace();
        return;
    }

    if(button.classList.contains('equal')){
        evaluate();
        return;
    }

    if(button.classList.contains('operator')){
        setOperator(value);
        return;
    }

    appendToDisplay(value);
}

const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.buttons button')

let firstOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button))
});
