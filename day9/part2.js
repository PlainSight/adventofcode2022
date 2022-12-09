var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var segments = [
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0]
];

var posy = {};

input.forEach(i => {
    var parts = i.split(' ');
    var d = parts[0];
    var m = parseInt(parts[1]);

    var targetx = segments[0][0];
    var targety = segments[0][1];

    switch (d) {
        case 'R':
            targetx += m;
        break;
        case 'L':
            targetx -= m;
        break;
        case 'U':
            targety += m;
        break;
        case 'D':
            targety -= m;
        break;
    }

    while (targetx != segments[0][0] || targety != segments[0][1]) {
        for(var s = 0; s < segments.length; s++) {
            if (s == 0) {
                var dx = targetx - segments[0][0];
                var dy = targety - segments[0][1];
                if (dx != 0) {
                    segments[0][0] += dx / Math.abs(dx);
                }
                if (dy != 0) {
                    segments[0][1] += dy / Math.abs(dy);
                }
            } else {
                var pev = segments[s-1];
                var seg = segments[s];
        
                if (s == 9) {
                    posy[seg[0]+','+seg[1]] = true;
                }
    
                var dx = pev[0] - seg[0];
                var dy = pev[1] - seg[1];

                var t = false;

                if (Math.abs(dx) == 2 && dy == 0) {
                    seg[0] += (dx / Math.abs(dx));
                    t = true;
                }
                if (!t && Math.abs(dy) == 2 && dx == 0) {
                    seg[1] += (dy / Math.abs(dy));
                    t = true;
                }
                if (!t && (Math.abs(dx) + Math.abs(dy) >= 3)) {
                    seg[0] += (dx / Math.abs(dx));
                    seg[1] += (dy / Math.abs(dy));
                    t = true;
                }

                if (s == 9) {
                    posy[seg[0]+','+seg[1]] = true;
                }
            }
        }

    }
})

console.log(Object.values(posy).length);