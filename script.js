'use strict';

let inputObject = document.getElementById('exp');
let returnLastInputData = creatureFunctionReturnLastInputData();

inputObject.oninput = () => {
    let validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '(', ')'];
    let correctValue = inputObject.value;

    let newCharsOfInput = returnLastInputData(inputObject);

    if(!checkDataByChars(newCharsOfInput, validChars)) {
        correctValue = errorDataEntry(correctValue, newCharsOfInput);
    }

    let codeResultTracking = trackingParenthesis(correctValue);

    if(codeResultTracking < 1) {
        correctValue = errorOpenParenthesis(-codeResultTracking, correctValue);
    }

    inputObject.value = correctValue;
};

function calculateFromPage(exp){
    if(!exp) return alert('Введите выражение!');
    alert(getResultCalculationExpression(exp));
}

/*Functions*/

function getResultCalculationExpression(chars) {
    let levelsObject = {};
    let level = 0;

    for(let i = 0; i < chars.length; i++) {
        if(chars[i] == '(') {
            let parentPosition;

            !level ? parentPosition = null : parentPosition = levelsObject['level' + (level - 1)].myPosition;

            let myPosition = i;

            let elementOfLevelsObject = {
                myPosition,
                parentPosition,
            };

            levelsObject['level' + level] = elementOfLevelsObject;

            level++;
        }
        if(chars[i] == ')') {
            let expression = chars.slice(levelsObject['level' + (level - 1)].myPosition + 1, i);

            let startIndex = levelsObject['level' + (level - 1)].myPosition;
            let endIndex = i;
            let calculationResult = getCalculationResult(expression);

            chars = replaceChars(startIndex, endIndex, chars, calculationResult);
            i = i - ((endIndex - startIndex) - calculationResult.length) - 1

            delete levelsObject['level' + (level - 1)];
            level--;
        }
    }
    return getCalculationResult(chars);
}

function calculate(a, b, operation) {
    switch (operation) {
        case 'mult':
            return a * b;
            break;
        case 'div':
            return a / b;
            break;
        case 'add':
            return +a + +b;
            break;
        case 'sub':
            return a - b;
            break;
    }
}

function getCalculationResult(expression) {
    let result = expression;

    repeat(expression);

    function repeat(expression) {

        if(expression.includes('/') || expression.includes('*')) {
            let objectExpression = {
                startFirstIndexNumber: 0,
            };

            multAndSub:
            for(let i = 0; i < expression.length; i++) {
                if(expression[i] == '-') objectExpression.startFirstIndexNumber = i + 1;
                if(expression[i] == '+') objectExpression.startFirstIndexNumber = i + 1;
                if(expression[i] == '*') {
                    objectExpression.endFirstIndexNumber = i;
                    objectExpression.operation = 'mult';
                    objectExpression.startSecondIndexNumber = i + 1;
                    for(let j = i + 1; j < expression.length; j++) {
                        if((j + 1) == expression.length) {
                            objectExpression.endSecondIndexNumber = j + 1;
                            break multAndSub;
                        }
                        if(expression[j] == '-' || expression[j] == '+' || expression[j] == '/' || expression[j] == '*') {
                            objectExpression.endSecondIndexNumber = j;
                            break multAndSub;
                        }
                    }
                }
                if(expression[i] == '/') {
                    objectExpression.endFirstIndexNumber = i;
                    objectExpression.operation = 'div';
                    objectExpression.startSecondIndexNumber = i + 1;
                    for(let j = i + 1; j < expression.length; j++) {
                        if((j + 1) == expression.length) {
                            objectExpression.endSecondIndexNumber = j + 1;
                            break multAndSub;
                        }
                        if(expression[j] == '-' || expression[j] == '+' || expression[j] == '/' || expression[j] == '*') {
                            objectExpression.endSecondIndexNumber = j;
                            break multAndSub;
                        }
                    }
                }
            }
            let a = expression.slice(objectExpression.startFirstIndexNumber, objectExpression.endFirstIndexNumber);
            let b = expression.slice(objectExpression.startSecondIndexNumber, objectExpression.endSecondIndexNumber);
            let operation = objectExpression.operation;

            let startIndex = objectExpression.startFirstIndexNumber;
            let endIndex = objectExpression.endSecondIndexNumber - 1;

            result = replaceChars(startIndex, endIndex, expression, calculate(a, b, operation));

            repeat(result);
            return;
        }
        if(expression.includes('-') || expression.includes('+')) {
            let objectExpression = {
                startFirstIndexNumber: 0,
            };

            addAndSub:
            for(let i = 0; i < expression.length; i++) {
                if(expression[i] == '+') {
                    objectExpression.endFirstIndexNumber = i;
                    objectExpression.operation = 'add';
                    objectExpression.startSecondIndexNumber = i + 1;
                    for(let j = i + 1; j < expression.length; j++) {
                        if((j + 1) == expression.length) {
                            objectExpression.endSecondIndexNumber = j + 1;
                            break addAndSub;
                        }
                        if(expression[j] == '-' || expression[j] == '+') {
                            objectExpression.endSecondIndexNumber = j;
                            break addAndSub;
                        }
                    }
                }
                if(expression[i] == '-') {
                    if(i == 0) {
                        if(!expression.includes('+') && !expression.includes('-', 1)) return;
                        continue;
                    }
                    objectExpression.endFirstIndexNumber = i;
                    objectExpression.operation = 'sub';
                    objectExpression.startSecondIndexNumber = i + 1;
                    for(let j = i + 1; j < expression.length; j++) {
                        if((j + 1) == expression.length) {
                            objectExpression.endSecondIndexNumber = j + 1;
                            break addAndSub;
                        }
                        if(expression[j] == '-' || expression[j] == '+') {
                            objectExpression.endSecondIndexNumber = j;
                            break addAndSub;
                        }
                    }
                }
            }

            let a = expression.slice(objectExpression.startFirstIndexNumber, objectExpression.endFirstIndexNumber);
            let b = expression.slice(objectExpression.startSecondIndexNumber, objectExpression.endSecondIndexNumber);
            let operation = objectExpression.operation;
            let startIndex = objectExpression.startFirstIndexNumber;
            let endIndex = objectExpression.endSecondIndexNumber - 1;


            result = replaceChars(startIndex, endIndex, expression, calculate(a, b, operation));

            repeat(result);
        }
    }

    return result;
}

function replaceChars(startIndex, endIndex, chars, replaceValue) {
    let startChars = chars.slice(0, startIndex);
    let endChars = chars.slice(endIndex + 1, chars.length);
    return startChars + replaceValue + endChars;
}

function creatureFunctionReturnLastInputData() {
    let indexOfLastCharStart;
    let indexOfLastCharEnd;
    let countNewChars;
    let newChars;
    let beforeCountChars = 0;
    let afterCountChars;

    let getCountNewChars = (beforeCountChars, afterCountChars) => afterCountChars - beforeCountChars;

    return function(inputObject) {
        afterCountChars = inputObject.value.length;

        if(beforeCountChars >= afterCountChars) {
            beforeCountChars -= countNewChars;
        }

        countNewChars = getCountNewChars(beforeCountChars, afterCountChars);

        indexOfLastCharEnd = inputObject.selectionEnd;
        indexOfLastCharStart = indexOfLastCharEnd - countNewChars;

        newChars = inputObject.value.slice(indexOfLastCharStart, indexOfLastCharEnd);

        beforeCountChars = inputObject.value.length;

        if(!newChars) return false;
        return newChars;
    }
}

function checkDataByChars(chars, arrayValidChars) {
    for(let i = 0; i < chars.length; i++) {
        if(!arrayValidChars.includes(chars[i])) return false;
    }
    return true;
}

function errorDataEntry(value, deleteValue) {
    alert('Недопустимое значение!');
    return value.replace(deleteValue, '');
}

function deleteCharsOnIndex(startIndex, endIndex, chars) {
    let startChars = chars.slice(0, startIndex);
    let endChars = chars.slice(endIndex + 1, chars.length);
    return startChars + endChars;
}

function errorOpenParenthesis(indexError, chars) {
    alert('Для начала откройте скобку!');
    let correctValue = deleteCharsOnIndex(indexError, indexError, chars);

    repeat();

    function repeat() {
        let codeResultTracking = trackingParenthesis(correctValue);
        if(codeResultTracking < 1) {
            correctValue = deleteCharsOnIndex(-codeResultTracking, -codeResultTracking, correctValue);
            repeat();
        }
    }

    return correctValue;
}

function trackingParenthesis(chars) {
    let openParenthesis = 0;
    let codeResult = 1; // 1 - все хорошо, 2 - не закрыты все скобки, отрицательное значение - попытка закрыть не открытую скобку, значение является позицией ошибки

    if(!chars) return codeResult;

    if(!chars.includes('(') && !chars.includes(')')) return codeResult;

    for(let i = 0; i < chars.length; i++) {
        if(chars[i] == '(') {
            openParenthesis++;
        }

        if(chars[i] == ')') {
            if(openParenthesis < 1) return codeResult = -i;
            openParenthesis--;
        }
    }

    if(!openParenthesis) return codeResult;
    return codeResult = 2;
}