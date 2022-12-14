var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var elements = {};

var ay = 0;

// debug
var minx = Infinity;
var maxx = -Infinity;

input.forEach(i => {
    var parts = i.split(' -> ').map(n => n.split(',').map(m => parseInt(m)));
    for(var p = 0; p < parts.length-1; p++) {
        var q = p+1;
        var start = parts[p];
        var end = parts[q];

        var sx = start[0];
        var sy = start[1];

        var adx = 0;
        var ady = 0;        

        var dx = end[0] - start[0];
        adx = Math.abs(dx);
        if(dx != 0) {
            dx = dx / Math.abs(dx);
        }
        var dy = end[1] - start[1];
        ady = Math.abs(dy);
        if (dy != 0) {
            dy = dy / Math.abs(dy);
        }

        for(var i = 0; i <= Math.max(adx, ady); i++) {
            var xx = sx + (dx*i);
            var yy = sy + (dy*i);
            if (yy > ay) {
                ay = yy;
            }
            if (xx < minx) {
                minx = xx;
            }
            if (xx > maxx) {
                maxx = xx;
            }
            elements[xx+','+yy] = 'r';
        }
    }
});

var ox = 500;
var oy = 0;

var sandCount = 0;

outer: while(true) {
    // flow sand

    var x = ox;
    var y = oy;

    inner: while(true) {
        // simulate sand

        if (x < minx) {
            minx = x;
        }
        if (x > maxx) {
            maxx = x;
        }

        if (y > ay) {
            break outer;
        }

        if (!elements[x+','+(y+1)]) {
            // down
            y++;
        } else {
            if (!elements[(x-1)+','+(y+1)]) {
                // left
                x--;
                y++;
            } else {
                if (!elements[(x+1)+','+(y+1)]) {
                    // right
                    x++;
                    y++;
                } else {
                    elements[x+','+y] = 's';
                    sandCount++;
                    break inner;
                }
            }
        }
    }

}

// debug
// for (var y = 0; y <= ay; y++) {
//     var line = '';
//     for(var x = minx; x <= maxx; x++) {
//         line += elements[x+','+y] ? elements[x+','+y] : '.';
//     }
//     console.log(line);
// }

console.log(sandCount);