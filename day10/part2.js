var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var X = 1;
var cycle = 1;

var screen = [[],[],[],[],[],[]];

var x = 0;
var y = 0;

input.forEach(i => {
    var parts = i.split(' ');

    function incCycle() {
        if (Math.abs(x - X) < 2) {
            screen[y][x] = '#';
        } else {
            screen[y][x] = ' ';
        }
        x++;
        if (x >= 40) {
            x = 0;
            y++;
        }
        cycle++;
    }

    switch (parts[0]) {
        case 'addx':
            incCycle();
            incCycle();
            X += parseInt(parts[1]);
        break;
        case 'noop':
            incCycle();
        break;
    }
})

console.log(screen.map(r => r.join('')).join('\r\n'));