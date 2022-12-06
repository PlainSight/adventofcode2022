var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8');

var last4 = [];

var first = -1;

input.split('').forEach((c, i) => {
    if (last4.length == 14) {
        last4.push(c);
        last4.shift();
    } else {
        last4.push(c);
    }

    if (last4.length == 14) {
        var distinct = last4.reduce((a, c) => {
            a[c] = true;
            return a;
        }, {});
        if (Object.values(distinct).length == 14 && first == -1) {
            first = i;
        }
    }
});

console.log(first+1);