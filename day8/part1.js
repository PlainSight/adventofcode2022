var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split('').map(n => parseInt(n)));

function search(x, y, dx, dy) {
    var tx = x + dx;
    var ty = y + dy;
    while(tx >= 0 && ty >= 0 && tx < input[0].length && ty < input.length) {
        if (input[y][x] <= input[ty][tx]) {
            return false;
        }
        tx += dx;
        ty += dy;
    } 
    return true;
}

var count = 0;

for(var x = 0; x < input[0].length; x++) {
    for(var y = 0; y < input.length; y++) {
        if (search(x, y, 1, 0) ||
        search(x, y, -1, 0) ||
        search(x, y, 0, 1) ||
        search(x, y, 0, -1)) {
            count++;
        }
    }
}

console.log(count);