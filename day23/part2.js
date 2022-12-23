var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var elves = [];

input.forEach((l, li) => {
    l.split('').forEach((c, ci) => {
        if (c == '#') {
            elves.push({
                x: ci,
                y: li
            });
        }
    })
})

// -1 is north

var dcons = [
    [   // north
        [-1, -1],
        [0, -1],
        [1, -1],
    ],
    [   // south
        [-1, 1],
        [0, 1],
        [1, 1],
    ],
    [   // west
        [-1, -1],
        [-1, 0],
        [-1, 1]
    ],
    [   // east
        [1, -1],
        [1, 0],
        [1, 1]
    ]
];

function checkFree(x, y) {
    var valid = dcons.map((d) => {
        var hits = d.filter(c => currentElfLocations[(x + c[0]) +',' +(y + c[1])]).length;
        return {
            move: [ x+d[1][0], y+d[1][1]],
            valid: hits == 0
        }
    })
    return valid;
}

function draw() {
    var xs = elves.map(e => e.x);
    var ys = elves.map(e => e.y);

    var minx = Math.min(...xs);
    var miny = Math.min(...ys);
    var maxx = Math.max(...xs);
    var maxy = Math.max(...ys);

    for (var l = miny; l <= maxy; l++) {
        var line = '';
        for(var c = minx; c <= maxx; c++) {
            if (elves.filter(e => e.x == c && e.y == l).length > 0) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

var currentElfLocations = {};

var time = 0;

while (true) {
    var checkOrder = time % 4;

    var proposedDestinations = {};

    currentElfLocations = {};

    elves.forEach(e => {
        currentElfLocations[e.x+','+e.y] = true;
    })

    // plan
    elves.forEach(e => {
        var moves = checkFree(e.x, e.y);
        e.nx = e.x;
        e.ny = e.y;
        if (moves.filter(m => m.valid).length == 4) {
            // do nothing
            proposedDestinations[e.x+','+e.y] = (proposedDestinations[e.x+','+e.y] || 0) + 1;
        } else {
            var foundMove = false;
            var checkIndex = checkOrder;
priority:  for(var j = 0; j < 4; j++) {
                if (moves[checkIndex].valid) {
                    var destX = moves[checkIndex].move[0];
                    var destY = moves[checkIndex].move[1];
                    proposedDestinations[destX+','+destY] = (proposedDestinations[destX+','+destY] || 0) + 1;
                    e.nx = destX;
                    e.ny = destY;
                    foundMove = true;
                    break priority;
                }

                checkIndex = ((checkIndex + 1) % 4);
            }

            if (!foundMove) {
                proposedDestinations[e.x+','+e.y] = (proposedDestinations[e.x+','+e.y] || 0) + 1;
            }
        }
    });

    var moves = 0;
    
    // move
    elves.forEach(e => {
        if (proposedDestinations[e.nx+','+e.ny] == 1) {
            if (e.x != e.nx || e.y != e.ny) {
                moves ++;
                e.x = e.nx;
                e.y = e.ny;
            }
        }
    })

    time++;

    if (moves == 0) {
        break;
    }
}

console.log(time)