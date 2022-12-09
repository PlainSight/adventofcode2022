var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var hx = 0;
var hy = 0;
var tx = 0;
var ty = 0;

var posy = {};

input.forEach(i => {
    var parts = i.split(' ');
    var d = parts[0];
    var m = parseInt(parts[1]);


    switch (d) {
        case 'R':
            hx += m;
        break;
        case 'L':
            hx -= m;
        break;
        case 'U':
            hy += m;
        break;
        case 'D':
            hy -= m;
        break;
    }

    var escape = true;

    while(escape) {
        posy[tx+','+ty] = true;

        var dx = hx - tx;
        var dy = hy - ty;

        var t = false;

        if (Math.abs(dx) == 2 && dy == 0) {
            tx += (dx / Math.abs(dx));
            t = true;
        }
        if (Math.abs(dy) == 2 && dx == 0) {
            ty += (dy / Math.abs(dy));
            t = true;
        }
        if (!t && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
            if (dx != 0) {
                tx += (dx / Math.abs(dx));
            }
            if (dy != 0) {
                ty += (dy / Math.abs(dy));
            }
        }

        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            escape = false;
        }
    }
})

console.log(Object.values(posy).length);