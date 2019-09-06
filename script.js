'use strict';

function calculate(exp) {

    let source = exp;

    let arrOperations = ['+', '-', '*', '/'];
    let methods = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
    }

    exp = exp.replace(/\s/g, "");

    for(let i = 0; i < arrOperations.length; i++) {
        let replace = '\\' + arrOperations[i];
        let replaceFrom = new RegExp(replace,'g');
        let replaceTO = ` ${arrOperations[i]} `;
        exp = exp.replace(replaceFrom, replaceTO);
    }

    exp = exp.split(' ');

    let check = true;

    for(let i = 0; i < exp.length; i++) {
        if (exp.length < 3) {
            check = false;
            break;
        }

        if ((i + 1) % 2 == 0 && (i + 1) < exp.length) {
            let resOperand = false;
            arrOperations.forEach(item => {
                if(exp[i] === item) resOperand = true;
            });
            if(!resOperand) {
                check = false;
                break;
            }
            continue;
        }

        if ((i + 1) % 2 == 0 && (i + 1) >= exp.length) {
            check = false;
            break;
        }

        if(exp[i] === '' || exp[i] === undefined || exp[i] === null) {
            check = false;
            break;
        }

        let number = +exp[i];
        if(!number && number !== 0) {
            check = false;
            break;
        }
    }

    if(check) {
        alert(`Результат вычисления: ${eval(source)}`);
    }
    else {
        alert('Неверное выражение');
    }
}