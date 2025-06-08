const display = document.getElementById("display");

// enter digits/operators to the 'display'
function append(char) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = display.value.slice(-1);

    if (operators.includes(char)) {
        // prevents entering multiple operators at once (like +-++-)
        if (operators.includes(lastChar)) {
            display.value = display.value.slice(0, -1) + char;
            return;
        }
        // don't add operators if input field is empty
        if (display.value === '') return;
    }
    display.value += char;
}

// clears the entire display
function clearDisplay() {
    display.value = "";
}

// deletes the last character in the input field
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Evaluates the expression and shows result
function preprocessInput(input) {

    // bracket handling for '(' and ')'
    input = input.replace(/(\d)\(/g, '$1*(');

    // percentage handling after + and -
    input = input.replace(/([0-9.]+)\s*([\+\-])\s*([0-9.]+)%/g, function (match, num1, op, num2) {
        return `${num1}${op}(${num1}*${num2}/100)`;
    });
    
    // percentage handling after * and /
    input = input.replace(/([0-9.]+)\s*([\*\/])\s*([0-9.]+)%/g, function (match, num1, op, num2) {
        return `${num1}${op}(${num2}/100)`;
    });
    
    // percentage handling for just between two numbers like 100 % 10
    input = input.replace(/([0-9.]+)%([0-9.]+)/g, '($1/100)*$2');

    // percentage handling for just one number like 100%
    input = input.replace(/([0-9.]+)%/g, '($1/100)');

    // checking bracket balance and adding 'close' brackets if needed
    const openBrackets = (input.match(/\(/g) || []).length;
    const closeBrackets = (input.match(/\)/g) || []).length;
    const unmatched = openBrackets - closeBrackets;
    if (unmatched > 0) {
        input += ')'.repeat(unmatched);
    }
    return input;
}

// calculate() function with error handling
function calculate() {
    try {
        let expression = preprocessInput(display.value);

        let result = eval(expression);

        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = result.toFixed(4);
            result = parseFloat(result).toString();
        }

        display.value = result;
    } catch (error) {
        display.value = "Error";
    }
}

document.addEventListener('keydown', (e) => {
    // console.log(e.key)  // For debug purpose
    if (!isNaN(e.key) || ['+', '-', '*', '/', '.', '(', ')', '%'].includes(e.key)) {
        append(e.key);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        // Condition to check if error shows in result, pressing backsapce clears everything
        if (display.value === "Error" || display.value === "Infinity") {
            clearDisplay();
        } else {
            backspace();
        }
    }
    else if (e.key.toLowerCase() === 'c') {
        clearDisplay();
    }
});


// always focus on the input box
window.onload = () => display.focus();
document.addEventListener('click', () => display.focus());