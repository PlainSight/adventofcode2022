var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sensors = [];

input.forEach(i => {
    var elements = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(i);
    var sx = parseInt(elements[1]);
    var sy = parseInt(elements[2]);
    var bx = parseInt(elements[3]);
    var by = parseInt(elements[4]);

    sensors.push({
        x: sx,
        y: sy,
        distance: Math.abs(sx - bx) + Math.abs(sy - by)
    });
});

function distance(x, y, xx, yy) {
    return Math.abs(x - xx) + Math.abs(y - yy);
}

var bound = 4000000; // 20
var mul = 4000000;
var dim = 4194304; // 32

function createQuad(x, y, w, h) {
    var q = {
        children: [],
        x: x,
        y: y,
        w: w,
        h: h,
        senseState: (x > bound || y > bound) ? 'full' : 'unsensed',
        within: function(xx, yy, d) {
            var corners = [
                [this.x, this.y],
                [this.x, this.y+this.h-1],
                [this.x+this.w-1, this.y],
                [this.x+this.w-1, this.y+this.h-1]
            ];
            return corners.filter(c => {
                return distance(c[0], c[1], xx, yy) <= d;
            }).length == 4;
        },
        touches: function(xx, yy, d) {
            var horizontal = [this.x, this.x+this.w-1];
            var vertical = [this.y, this.y+this.h-1];

            var cx = this.x;
            var cy = this.y;

            var xWithin = false;
            var yWithin = false;

            if (horizontal[0] <= xx && xx <= horizontal[1]) {
                xWithin = true;
                cx = xx;
            } else {
                if (xx < horizontal[0]) {
                    cx = horizontal[0];
                } else {
                    cx = horizontal[1]
                }
            }

            if (vertical[0] <= yy && yy <= vertical[1]) {
                yWithin = true;
                cy = yy;
            } else {
                if (yy < vertical[0]) {
                    cy = vertical[0];
                } else {
                    cy = vertical[1]
                }
            }

            return distance(cx, cy, xx, yy) <= d || (xWithin && yWithin);
        }
    };
    return q;
}

var root = createQuad(0, 0, dim, dim);

function addSensor(s, q, factor) {
    if (q.senseState == 'full') {
        return;
    }
    if(q.within(s.x, s.y, s.distance)) {
        q.senseState = 'full';
        q.children = [];
    } else {
        if (q.touches(s.x, s.y, s.distance)) {
            q.senseState = 'partial';
            if (q.w > factor && q.h > factor) {
                // split if not split
                if (q.children.length == 0) {
                    //console.log('making children for', q);
                    q.children = [
                        createQuad(q.x, q.y, q.w/2, q.h/2),
                        createQuad(q.x+q.w/2, q.y, q.w/2, q.h/2),
                        createQuad(q.x, q.y+q.h/2, q.w/2, q.h/2),
                        createQuad(q.x+q.w/2, q.y+q.h/2, q.w/2, q.h/2)
                    ];
                }
                q.children.forEach(c => {
                    addSensor(s, c, factor);
                })
            }
        }
    }
}

sensors.forEach(s => {
    addSensor(s, root, 64);
});

sensors.forEach(s => {
    addSensor(s, root, 1);
});

function explore(q) {
    if (q.senseState == 'full') {
        return;
    }
    if (q.senseState == 'partial') {
        q.children.forEach(c => explore(c));
    } else {
        if (q.x > bound || q.y > bound) {
            return;
        }
        console.log((q.x*mul)+q.y);
        process.exit();
    }
}

explore(root);