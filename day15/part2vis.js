var fs = require('fs');
var canvasLib = require('canvas');

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

function explore(q, draw) {
    if (draw) {
        draw(q.x, q.y, q.w, q.h);
    }
    if (found) {
        return;
    }
    if (q.senseState == 'full') {
        return;
    }
    if (q.senseState == 'partial') {
        q.children.forEach(c => explore(c, draw));
    } else {
        if (q.x > bound || q.y > bound) {
            return;
        }
        found = q;
        console.log((q.x*mul)+q.y);
    }
}

var imageSize = 2048;

var canvas = canvasLib.createCanvas(imageSize, imageSize);
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);
context.lineWidth = 1;
context.strokeStyle = '#000000';

sensors.forEach(s => {
    addSensor(s, root, 4096);
});

var scalingFactor = dim / imageSize;

explore(root, (x, y, w, h) => {
    context.strokeRect(x/scalingFactor, y/scalingFactor, w/scalingFactor, h/scalingFactor);
});

sensors.forEach(s => {
    addSensor(s, root, 128);
});

sensors.forEach(s => {
    addSensor(s, root, 1);
});

var found = null;

explore(root);

context.fillStyle = 'rgba(0, 0, 255, 0.2)';
context.strokeStyle = '#0000ff';

sensors.forEach(s => {
    context.beginPath();
    // left
    context.moveTo((s.x-s.distance)/scalingFactor, s.y/scalingFactor);
    // top
    context.lineTo(s.x/scalingFactor, (s.y-s.distance)/scalingFactor);
    // right
    context.lineTo((s.x+s.distance)/scalingFactor, s.y/scalingFactor);
    // bottom
    context.lineTo(s.x/scalingFactor, (s.y+s.distance)/scalingFactor);
    context.closePath();
    context.fill();
    context.stroke();
});

context.strokeStyle = '#ff0000';
context.strokeRect((found.x/scalingFactor)-10, (found.y/scalingFactor)-10, (found.w/scalingFactor)+20, (found.h/scalingFactor)+20);

context.strokeStyle = '#00ff00';
context.strokeRect(0, 0, 4000000/scalingFactor, 4000000/scalingFactor);

var buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./graph.png', buffer);