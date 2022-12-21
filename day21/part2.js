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

function gcd_two_numbers(x, y) {
    x = x < 0 ? -x : x;
    y = y < 0 ? -y : y;
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function resolveMagic(number) {
    console.log('resolving', magic.join(' '), 'to', number);

    // need to simplify magic
    var numerator = BigInt(number);
    var denominator = BigInt(1);
    
    function simplify() {
        var gcd = gcd_two_numbers(numerator, denominator);
        numerator /= gcd;
        denominator /= gcd;
    }

    while(magic.length) {
        var top = magic.pop();
        // if (numerator >= Number.MAX_SAFE_INTEGER) {
        //     console.log('FUCK', numerator);
        // }
        switch (top) {
            case '+':
                numerator += (denominator*BigInt(magic.pop()));
            break;
            case '-':
                numerator -= (denominator*BigInt(magic.pop()));
            break;
            case '*':
                var multiplier = BigInt(magic.pop());
                numerator *= multiplier;
            break;
            case '/':
                var divider = BigInt(magic.pop());
                denominator *= divider;
            break;
        }
        simplify();
    }
    console.log(numerator, denominator);
}

while(stack.length > 0) {
    var top = stack.pop();

    switch (top) {
        case '=':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left)) {
                resolveMagic(right);
            } else {
                if (left == right) {
                    console.log("ROFL", left);
                } else {
                    resolveMagic(left);
                }
            }
        break;
        case '+':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                magic.push(isNaN(left) ? right : left);
                magic.push('-');
                values.push('magic');
            } else {
                values.push(parseInt(left) + parseInt(right));
            }
        break;
        case '-':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                magic.push(isNaN(left) ? right : left);
                magic.push('+');
                values.push('magic');
            } else {
                values.push(parseInt(left) - parseInt(right));
            }
        break;
        case '*':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                magic.push(isNaN(left) ? right : left);
                magic.push('/');
                values.push('magic');
            } else {
                values.push(parseInt(left) * parseInt(right));
            }
        break;
        case '/':
            var left = values.pop();
            var right = values.pop();
            if (isNaN(left) || isNaN(right)) {
                magic.push(isNaN(left) ? right : left);
                magic.push('*');
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