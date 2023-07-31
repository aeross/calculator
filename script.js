// max 12 digits
const MAX_DIGITS = 12
const ERROR = "Err"
let n1 = "";

// the operand is an object. Only one of `add`, `subtract`,
// `multiply`, or `divide` can be true.
let operandObj = {
    add: false,
    subtract: false,
    multiply: false,
    divide: false,
};
let n2 = "";
let ans = "";
let screenDisp = "";

/* Variable to determine whether to store the next value at n1 or n2. 
If 0, store the next value at n1. If 1, store the next value at n2.
The `operand` buttons switches the variable's true or false value.
The `=` button resets it back to true. */
this.inputAtFirstNum = true;


function checkErr(n) {
    if ((""+n).length > MAX_DIGITS) {
        return true;
    }
    return false;
}

function updateScreenDisp(additionalDisp) {
    screenDisp += additionalDisp;
    const screen = document.querySelector("#screen-content");
    screen.innerHTML = screenDisp;
}


class Maths {
    /* Operand methods. All methods return strings. */
    add(n1, n2) {
        let val = n1 + n2;
        if (checkErr(val)) {
            return ERROR;
        }
        return val.toString();
    }

    subtract(n1, n2) {
        let val = n1 - n2;
        if (checkErr(val)) {
            return ERROR;
        }
        return val.toString();
    }

    multiply(n1, n2) {
        let val = n1 * n2;
        if (checkErr(val)) {
            return ERROR;
        }
        return val.toString();
    }

    divide(n1, n2) {
        // can't divide by 0!
        if (n2 == 0) {
            return ERROR;
        }

        let val = n1 / n2;
        if (checkErr(val)) {
            // round the decimals off so that the total num of digits is 12
            // `beforePoint` is the number of digits before decimal point, e.g.,
            // 123.45 will have `beforePoint` == 3
            let beforePoint = val.toString().split('.')[0];
            if (beforePoint.length == MAX_DIGITS) {
                return beforePoint;
            }
            if (beforePoint.length > MAX_DIGITS) {
                return ERROR;
            }
            val = val.toFixed(MAX_DIGITS - beforePoint.length - 1);
        } else {
            val = val.toString();
        }

        return val;
    }
}


class Action {
    /* methods */
    numberOnClick() {
        /* NOTE: addEventListener inside function can only access *global* 
        variables. Using this.var inside this class does not work unfortunately... */
        const buttons = document.querySelectorAll(".number");

        buttons.forEach((button) => {
            button.addEventListener("click", function() {
                // each button's number value (0, 1, 2, ...)
                var numberVal = button.innerHTML;

                // insert button's value to n1 or n2, if digit limit hasn't been reached
                if (inputAtFirstNum && (!checkErr(n1 + numberVal))) {
                    n1 += numberVal;
                    updateScreenDisp(numberVal);
                } else if (!inputAtFirstNum && (!checkErr(n2 + numberVal))) {
                    n2 += numberVal;
                    updateScreenDisp(numberVal);
                }
            })
        });
    }

    operandOnClick() {
        const operands = document.querySelectorAll(".operand");

        operands.forEach((operand) => {
            operand.addEventListener("click", function() {
                var className = operand.classList[1];

                // EDGE CASE: if n2 is not empty, automatically compute n1 `prevOperand` n2,
                // assign that value to n1, make n2 empty, then assign the new operand
                if (n2.length != 0) {
                    // TODO: ...
                }
                
                // OTHERWISE: ensure every value in `operandObj` is false
                for (let o in operandObj) {
                    if (operandObj[o] == true) {
                        return;
                    }
                }

                operandObj[className] = true;
                updateScreenDisp(operand.innerHTML);
                
                // toggle `inputAtFirstNum` to ensure the next button clicks
                // go to n2 instead of n1
                inputAtFirstNum = !inputAtFirstNum;
            })
        });
    }
}


let a = new Action();
a.numberOnClick();
a.operandOnClick();

/*
let calculator = new Maths();
console.log(calculator.add(2, 5));
console.log(calculator.add(2432, 5432));
console.log(calculator.add(112312312312312, 532432423));
console.log(calculator.multiply(243, 5));
console.log(calculator.multiply(123123122, 4325));
console.log(calculator.subtract(243, 55));
console.log(calculator.subtract(2, 3435));
console.log(calculator.subtract(2, 53432432432432342));
console.log(calculator.divide(10, 5));
console.log(calculator.divide(2, 5));
console.log(calculator.divide(20000000000000000, 5));
console.log(calculator.divide(21231231232, 554353454323423));
console.log(calculator.divide(2343231232, 543125));
console.log(calculator.divide(1234567890111, 2));
*/