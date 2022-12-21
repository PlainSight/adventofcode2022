var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var map = {};

input.forEach(i => {
    var parts = i.split(':').map(n => n.trim());

    map[parts[0]] = parts[1];

    if (parts[0] == 'root') {
        map[parts[0]] = parts[1].split(' ').map((p, i) => i == 1 ? '=' : p).join(' ');
    }
    if (parts[0] == 'humn') {
        map[parts[0]] = 'x';
    }
});

var stack = ['root'];

var values = [];

var magic = [];

function resolveMagic(number) {
    while(magic.length) {
        var top = magic.pop();
        switch (top) {
            case '+':
                number += magic.pop();
            break;
            case '-':
                number -= magic.pop();
            break;
            case 's':
                number = magic.pop() - number;
            break;
            case '*':
                number *= magic.pop();
            break;
            case '/':
                number /= magic.pop();
            break;
            case 'd':
                number = magic.pop() / number;
            break;
        }
    }
    return number;
}

while(stack.length > 0) {
    var top = stack.pop();

    switch (top) {
        case '=':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left)) {
                var answer = resolveMagic(right);
                console.log(answer);
            } else {
                if (left == right) {
                    console.log("Sides are equal");
                } else {
                    var answer = resolveMagic(left);
                    console.log(answer);
                }
            }
        break;
        case '+':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                if (isNaN(left)) {
                    magic.push(right);
                    magic.push('-');
                } else {
                    magic.push(left);
                    magic.push('-');
                }
                values.push('magic');
            } else {
                values.push(parseInt(left) + parseInt(right));
            }
        break;
        case '-':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                if (isNaN(left)) {
                    magic.push(right);
                    magic.push('+');
                } else {
                    magic.push(left);
                    magic.push('s');
                }
                values.push('magic');
            } else {
                values.push(parseInt(left) - parseInt(right));
            }
        break;
        case '*':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                if (isNaN(left)) {
                    magic.push(right);
                    magic.push('/');
                } else {
                    magic.push(left);
                    magic.push('/');
                }
                values.push('magic');
            } else {
                values.push(parseInt(left) * parseInt(right));
            }
        break;
        case '/':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                if (isNaN(left)) {
                    magic.push(right);
                    magic.push('*');
                } else {
                    magic.push(left);
                    magic.push('d');
                }
                values.push('magic');
            } else {
                values.push(parseInt(left) / parseInt(right));
            }
        break;
        default:
            var parts = map[top].split(' ');

            if (parts.length > 1) {
                var left = parts[0];
                var operator = parts[1];
                var right = parts[2];
                stack.push(operator);
                stack.push(left);
                stack.push(right);
            } else {
                values.push(parts[0]);
            }
        break;
    }
}