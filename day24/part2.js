var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

var blizzards = [];

input.forEach((l, y) => {
    l.forEach((c, x) => {
        if (c != '.' && c != '#') {
            var dx = 0;
            var dy = 0;
            switch(c) {
                case '>':
                    dx = 1;
                break;
                case '<':
                    dx = -1;
                break;
                case 'v':
                    dy = 1;
                break;
                case '^':
                    dy = -1;
                break;
            }

            blizzards.push({
                x: x,
                y: y,
                dx: dx,
                dy: dy
            });
        }
    })
})

var minx = 1;
var maxx = input[0].length - 2;
var miny = 1;
var maxy = input.length - 2;

var stateByTime = {};

var found = false;
var time = 0;

stateByTime[0] = {
    '1,0,0': {
        x: 1,
        y: 0,
        s: 0
    }
}

function findValidMove(x, y, blizzMap) {
    return [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ].filter(d => {
        var nx = x+d[0];
        var ny = y+d[1];
        if (nx < minx || ny < 0 || nx > maxx || (ny < miny && nx != minx) || (ny > maxy && nx != maxx) || ny > maxy+1) {
            return false;
        }
        return !blizzMap[nx+','+ny];
    }).map(d => {
        return {
            x: (x+d[0]),
            y: (y+d[1])
        }
    });
}

while (!found) {
    stateByTime[time+1] = {};

    // simulate blizzard step

    blizzards.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x > maxx) {
            b.x = minx;
        } else {
            if (b.x < minx) {
                b.x = maxx;
            } else {
                if (b.y > maxy) {
                    b.y = miny;
                } else {
                    if (b.y < miny) {
                        b.y = maxy;
                    }
                }
            }
        }
    })

    var blizzardMap = blizzards.reduce((a, c) => {
        a[c.x+','+c.y] = true;
        return a;
    }, {});
    
    Object.values(stateByTime[time]).forEach(top => {
        if (top.x == maxx && top.y == maxy+1 && top.s == 2) {
            found = true;
        }
        var ns = top.s;
        if (top.x == maxx && top.y == maxy+1 && top.s == 0) {
            ns = 1;
        }
        if (top.x == minx && top.y == miny-1 && top.s == 1) {
            ns = 2;
        }

        var moves = findValidMove(top.x, top.y, blizzardMap);
    
        moves.forEach(m => {
            stateByTime[time+1][m.x+','+m.y+','+ns] = {
                x: m.x,
                y: m.y,
                s: ns
            };
        });
    })

    time++;
}

console.log(time-1);