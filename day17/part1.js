var fs = require('fs');

var pattern = fs.readFileSync('./input.txt', 'utf8').split('');

var rocks = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`.split('\n\n').map(ro => {
    var elements = [];
    var rows = ro.split('\n');
    rows.forEach((r, y) => {
        r.split('').forEach((c, x) => {
            if (c == '#') {
                elements.push({ x: x, y: (rows.length-1)-y });
            }
        })
    })
    return elements;
});

var chamber = {};

function check(x, y) {
    return !!chamber[x+','+y] && y >= 0 && x >= 0 && x < 7;
}

function print() {
    for(var y = highestRockY; y >= 0; y--){
        var line = '';
        for (var x = 0; x < 7; x++) {
            line += check(x, y) ? '#' : '.';
        }
        console.log(line);
    }
}

function place(x, y) {
    chamber[x+','+y] = true;
    if (y+1 > highestRockY) {
        highestRockY = y+1;
    }
}

function checkShape(x, y, shape) {
    var bad = false;
    rocks[shape].forEach(s => {
        if(!(!chamber[(x+s.x)+','+(y+s.y)] && (y+s.y) >= 0 && (x+s.x) >= 0 && (x+s.x) < 7)) {
            //console.log('bad', x, y, s);
            bad = true;
        }
    })
    return !bad;
}

function placeShape(x, y, shape) {
    rocks[shape].forEach(s => {
        place(x+s.x, y+s.y);
    })
}

var count = 0;

var highestRockY = 0;

var currentRockType = 0;
var currentRockX = 2;
var currentRockY = 3;

var currentPatternId = 0;

while(count < 2022) {
    var settled = false;
    currentRockX = 2;
    currentRockY = highestRockY + 3;

    //print();
    //console.log('~~~~~~~ spawing  ' + currentRockType + ' at ' + currentRockX + ', ' + currentRockY);

    while(!settled) {
        var currentPattern = pattern[currentPatternId];

        var dx = currentPattern == '<' ? -1 : 1;

        //console.log('try shift ' + dx);
        if (checkShape(currentRockX+dx, currentRockY, currentRockType)) {
            currentRockX += dx;
            //console.log('move ' + (dx > 0 ? 'right' : 'left') + currentPattern);
        }

        if (checkShape(currentRockX, currentRockY-1, currentRockType)) {
            currentRockY -= 1;
            //console.log('drop');
        } else {
            placeShape(currentRockX, currentRockY, currentRockType);
            //console.log('place');
            settled = true;
        }

        currentPatternId = (currentPatternId + 1) % pattern.length;
    }

    currentRockType = (currentRockType+1) % rocks.length;
    count++;
}



console.log(highestRockY);