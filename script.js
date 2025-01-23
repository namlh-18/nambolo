const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    currentBase: 10
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) return;

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,

    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,

    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,

    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,

    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (!target.classList.contains('base-convert')){
        inputDigit(target.value);
    }
    updateDisplay();
});
// Thêm hàm chuyển đổi hệ cơ số
function convertBase(newBase) {
    const inputValue = calculator.displayValue;
    if (inputValue === '') return;

    const decimalValue = parseInt(inputValue, calculator.currentBase);
    if (isNaN(decimalValue)) return;

    let convertedValue;
    switch (parseInt(newBase)) {
        case 2:
            convertedValue = decimalValue.toString(2);
            calculator.currentBase = 2;
            break;
        case 8:
            convertedValue = decimalValue.toString(8);
            calculator.currentBase = 8;
            break;
        case 10:
            convertedValue = decimalValue.toString(10);
            calculator.currentBase = 10;
            break;
        case 16:
            convertedValue = decimalValue.toString(16).toUpperCase();
            calculator.currentBase = 16;
            break;
        default:
            convertedValue = inputValue;
    }

    calculator.displayValue = convertedValue;
    updateDisplay();
}

// Thêm sự kiện cho các nút chuyển đổi hệ cơ số
const baseButtons = document.querySelectorAll('.base-convert');
baseButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        convertBase(event.target.value);
    });
});

document.addEventListener('keydown', function(event) { 
    const key = event.key; 
    if (key >= '0' && key <= '9') { 
        inputDigit(key); 
    } 
    else if (key === '.') { 
        inputDecimal(key); 
    } 
    else if (key === '+' || key === '-' || key === '*' || key === '/') { 
        handleOperator(key); 
    } 
    else if (key === 'Enter' || key === '=') { 
        handleOperator('='); 
    } 
    else if (key === 'Escape') { 
        resetCalculator(); 
    } 
    else if (key.toLowerCase() === 'q') { 
        convertBase(2); 
    } 
    else if (key.toLowerCase() === 'o') { 
        convertBase(8); 
    } 
    else if (key.toLowerCase() === 'p') { 
        convertBase(10); 
    }
    else if (key.toLowerCase() === 'h') {
        convertBase(16); 
    } 
    else if (key >= 'A' && key <= 'F' && key != 'Backspace' || key >= 'a' && key <= 'f' && key != 'Backspace') { 
        calculator.currentBase = 16;
        inputDigit(key.toString(16).toUpperCase()); 
    }
    else if (key === 'Backspace') { 
        deleteLastDigit(); 
    }
    updateDisplay(); 
});

function getCurrentBase() { 
    const inputValue = calculator.displayValue; 
    if (inputValue.match(/^[01]+$/)) { 
        return 2;
    } 
    else if (inputValue.match(/^[0-7]+$/)) { 
        return 8;
    } else if (inputValue.match(/^[0-9]+$/)) { 
        return 10; 
    } else if (inputValue.match(/^[0-9A-Fa-f]+$/)) { 
        return 16;
    } 
    return 10;
}

function deleteLastDigit() {
    const { displayValue } = calculator;
    if (displayValue.length > 1) {
        calculator.displayValue = displayValue.slice(0, -1);
    } else {
        calculator.displayValue = '0';
    }
}
