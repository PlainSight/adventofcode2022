var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var columns = [];

var stacks = input[0].split('\r\n');

stacks.map((r, ii) => {
    if (ii == stacks.length - 1) {
        return;
    }
    for(var i = 0; i < r.length; i++) {
        if (/[a-zA-Z]/.test(r.charAt(i))) {
            var num = 1 + Math.floor(i/4);
            columns[num] = (columns[num] || []);
            columns[num].unshift(r.charAt(i));
        }
    }
});


var instructions = input[1].split('\r\n');

instructions.forEach(i => {
    var parts = /move (\d+) from (\d+) to (\d+)/.exec(i);
    var q = parseInt(parts[1]);
    var f = parseInt(parts[2]);
    var t = parseInt(parts[3]);

    var stack = [];

    for(var c = 0; c < q; c++) {
        var moving = columns[f].pop();
        stack.push(moving);
    }

    for(var c = 0; c < q; c++) {
        columns[t].push(stack.pop());
    }
});

var res = columns.map(c => c.pop()).join('');

console.log(res);