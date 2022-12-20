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

function within(q, xx, yy, d) {
    var corners = [
        [q.x, q.y],
        [q.x, q.y+q.w-1],
        [q.x+q.w-1, q.y],
        [q.x+q.w-1, q.y+q.w-1]
    ];
    return corners.filter(c => {
        return distance(c[0], c[1], xx, yy) <= d;
    }).length == 4;
}

function touches(q, xx, yy, d) {
    var horizontal = [q.x, q.x+q.w-1];
    var vertical = [q.y, q.y+q.w-1];

    var cx = q.x;
    var cy = q.y;

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

function createQuad(x, y, w) {
    return {
        x: x,
        y: y,
        w: w,
        senseState: (x > bound || y > bound) ? 2 : 0,
        children: []
    };
}

var root = createQuad(0, 0, dim, dim);

function any(f, hint) {
    var j = 0;
    for (var i = hint; j < sensors.length; i = ((i+1)%sensors.length)) {
        j++;
        if (f(sensors[i])) {
            return i;
        }
    }
    return -1;
}

function addSensors(q, hint) {
    if (q.senseState == 2) {
        return;
    }
    if(any(s => within(q, s.x, s.y, s.distance), hint) >= 0) {
        q.senseState = 2;
        q.children = [];
    } else {
        hint = any(s => touches(q, s.x, s.y, s.distance), hint);
        if (hint >= 0) {
            q.senseState = 1;
            if (q.w > 1) {
                // split if not split
                if (q.children.length == 0) {
                    q.children = [
                        createQuad(q.x, q.y, q.w/2),
                        createQuad(q.x+q.w/2, q.y, q.w/2),
                        createQuad(q.x, q.y+q.w/2, q.w/2),
                        createQuad(q.x+q.w/2, q.y+q.w/2, q.w/2)
                    ];
                }
                q.children.forEach(c => {
                    addSensors(c, hint);
                })
            }
        }
    }
}

addSensors(root, 0);

function explore(q) {
    if (q.senseState == 2) {
        return;
    }
    if (q.senseState == 1) {
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