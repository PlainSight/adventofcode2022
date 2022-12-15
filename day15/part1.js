var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var beacons = {};
var sensors = [];

input.forEach(i => {
    var elements = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(i);
    var sx = parseInt(elements[1]);
    var sy = parseInt(elements[2]);
    var bx = parseInt(elements[3]);
    var by = parseInt(elements[4]);

    beacons[bx+','+by] = true;

    sensors.push({
        x: sx,
        y: sy,
        bx: bx,
        by: by,
        distance: Math.abs(sx - bx) + Math.abs(sy - by)
    });
});

var y = 2000000;

var impossible = {};

sensors.forEach(s => {
    var verticalDistance = Math.abs(s.y - y);
    if (verticalDistance <= s.distance) {
        var horizontalDistance = s.distance - verticalDistance;
        for(var x = s.x - horizontalDistance; x <= s.x + horizontalDistance; x++) {
            if (!beacons[x+','+y]) {
                impossible[x] = true;
            }
        }
    }
});

console.log(Object.keys(impossible).length);