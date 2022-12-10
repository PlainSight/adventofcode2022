var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var X = 1;
var cycle = 1;

var sum = 0;

function isCycleValue(c) {
    var val = c - 20;
    return val % 40 == 0;
}

input.forEach(i => {
    var parts = i.split(' ');

    var cycleValue = 0;
    var xValue = 0;

    switch (parts[0]) {
        case 'addx':
            if (isCycleValue(cycle+1)) {
                cycleValue = cycle+1;
                xValue = X;
            }
            cycle += 2;
            X += parseInt(parts[1]);
            if (isCycleValue(cycle)) {
                cycleValue = cycle;
                xValue = X;
            }
        break;
        case 'noop':
            cycle += 1;
            if (isCycleValue(cycle)) {
                cycleValue = cycle;
                xValue = X;
            }
        break;
    }

    if (cycleValue) {
        sum += (xValue * cycleValue);
    }
})


console.log(sum);
