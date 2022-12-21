var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var map = {};

input.forEach(i => {
    var parts = i.split(':').map(n => n.trim());

    map[parts[0]] = parts[1];
});

var stack = ['root'];

var values = [];

while(stack.length > 0) {
    var top = stack.pop();
    //console.log('top', top);
    //console.log(stack, values);

    switch (top) {
        case '+':
            values.push(values.pop() + values.pop());
        break;
        case '-':
            values.push(values.pop() - values.pop());
        break;
        case '*':
            values.push(values.pop() * values.pop());
        break;
        case '/':
            values.push(values.pop() / values.pop());
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
                values.push(parseInt(parts[0]));
            }
        break;
    }
}

console.log(values[0]);