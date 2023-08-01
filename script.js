// max 12 digits
const MAX_DIGITS = 12;
const ERROR = "Err";
const ANSWER = "Ans";
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
inputAtFirstNum = true;


function checkErr(n) {
    if ((""+n).length > MAX_DIGITS) {
        return true;
    }
    return false;
}

function updateScreenDisp(additionalDisp) {
    const screen = document.querySelector("#screen-content");
    if (additionalDisp === ERROR) {
        screenDisp = ERROR;
        screen.innerHTML = screenDisp;
        return;
    }
    if (screenDisp === ERROR) {
        screenDisp = "";
    }
    screenDisp += additionalDisp;
    screen.innerHTML = screenDisp;
}

function resetToDefault() {
    // reset everything to default
    n1 = "";
    operandObj = {
        add: false,
        subtract: false,
        multiply: false,
        divide: false,
    };
    n2 = "";
    screenDisp = "";
    inputAtFirstNum = true;
    updateScreenDisp("");
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
    /* The number buttons. */
    numberOnClick() {
        /* NOTE: addEventListener inside function can only access *global* 
        variables. Using this.var inside this class does not work unfortunately... */
        const buttons = document.querySelectorAll(".number");

        buttons.forEach((button) => {
            button.addEventListener("click", function() {
                // each button's number value (0, 1, 2, ...)
                var numberVal = button.innerHTML;

                // insert button's value to n1 or n2, if digit limit 
                // hasn't been reached and n1 or n2's screen display is not equal to Ans
                if (inputAtFirstNum && (!checkErr(n1 + numberVal)) && 
                  screenDisp.substring(0, ANSWER.length) !== ANSWER) {
                    n1 += numberVal;
                    updateScreenDisp(numberVal);
                } else if (!inputAtFirstNum && (!checkErr(n2 + numberVal)) && 
                  screenDisp.substring(screenDisp.length - ANSWER.length, screenDisp.length) !== ANSWER) {
                    n2 += numberVal;
                    updateScreenDisp(numberVal);
                }
            })
        });
    }


    /* The operand buttons. */
    operandOnClick() {
        const operands = document.querySelectorAll(".operand");

        operands.forEach((operand) => {
            operand.addEventListener("click", function() {
                var className = operand.classList[1];
                
                // ensure every value in `operandObj` is false
                // to prevent multiple operands. For example, 5 + 7 - 3
                for (let o in operandObj) {
                    if (operandObj[o] == true) {
                        return;
                    }
                }

                // the only exception is `-`, because it could also denote negative numbers.
                if (n1 === "") {
                    if (operand.innerHTML === "-") {
                        n1 += "-";
                        updateScreenDisp("-");
                    }
                    return;
                }
                if (n1 === "-") {
                    return;
                }

                operandObj[className] = true;
                updateScreenDisp(operand.innerHTML);
                
                // toggle `inputAtFirstNum` to ensure the next button clicks
                // go to n2 instead of n1
                inputAtFirstNum = !inputAtFirstNum;
            })
        });
    }

    /* AC and DEL buttons. */
    clearOnClick() {
        const AC = document.querySelector(".ac");
        const DEL = document.querySelector(".del");

        AC.addEventListener("click", resetToDefault);

        DEL.addEventListener("click", function() {
            const toBeDeleted = screenDisp.charAt(screenDisp.length - 1);

            // if `screenDisp` is `ERROR`
            if (screenDisp === ERROR) {
                resetToDefault();
            }

            // if `toBeDeleted` is an operand
            const operands = document.querySelectorAll(".operand");
            var operandList = [];
            operands.forEach((operand) => operandList.push(operand.innerHTML));
            if (operandList.includes(toBeDeleted)) {
                inputAtFirstNum = true;
                operandObj = {
                    add: false,
                    subtract: false,
                    multiply: false,
                    divide: false,
                };
            }

            // if `toBeDeleted` is a number
            else {
                if (inputAtFirstNum) {
                    // remove the last digit of n1
                    n1 = n1.substring(0, n1.length - 1);
                } else {
                    // remove the last digit of n2
                    n2 = n2.substring(0, n2.length - 1);
                }
            }

            screenDisp = screenDisp.substring(0, screenDisp.length - 1);
            updateScreenDisp("");
        });
    }

    /* = and Ans buttons */
    answerOnClick() {
        const EQ = document.querySelector(".eq");
        const ANS = document.querySelector(".ans");

        EQ.addEventListener("click", function() {
            // compute what's in `screenContent`.
            // ensure that n1 and n2 isn't empty as well.
            if (n2 === "" || n1 === "") {
                return;
            }

            // find what type of operand we're dealing with
            const maths = new Maths();
            let output;
            let operand;
            for (let o in operandObj) {
                if (operandObj[o] == true) {
                    operand = o;
                }
            }
            // then calculate
            switch (operand) {
                case "add": 
                    output = maths.add(Number(n1), Number(n2)); break;
                case "subtract":
                    output = maths.subtract(Number(n1), Number(n2)); break;
                case "multiply":
                    output = maths.multiply(Number(n1), Number(n2)); break;
                case "divide":
                    output = maths.divide(Number(n1), Number(n2)); break;
            }

            // handles how `n1`, `n2`, and everything else changes after pressing =
            resetToDefault();
            if (output === ERROR) {
                updateScreenDisp(ERROR);
            } else {
                updateScreenDisp(output);
                ans = output;
                n1 = output;
                n2 = "";
                inputAtFirstNum = true;
            }
        });

        ANS.addEventListener("click", function() {
            if (n1 === "") {
                n1 = ans;
                updateScreenDisp(ANSWER);
            } else if (!inputAtFirstNum && n2 === "") {
                n2 = ans;
                updateScreenDisp(ANSWER);
            }
        });
    }
}


let a = new Action();
a.numberOnClick();
a.operandOnClick();
a.clearOnClick();
a.answerOnClick();
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