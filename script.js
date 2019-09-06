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
        let a;
        for(let i = 0; i < exp.length;) {
            let op;
            let b;

            if (i == 0) {
                a = +exp[0];
                op = exp[1];
                b = +exp[2];
                i = 3;
            } else {
                op = exp[i];
                i++;
                b = +exp[i];
                i++
            }

            a = methods[op](a, b);
        }
        alert(`Результат вычисления выражения ${source}: ${a}`);
    }
    else {
        alert('Неверное выражение');
    }
}