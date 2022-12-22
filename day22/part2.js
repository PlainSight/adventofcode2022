var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var xpos = -1;
var ypos = 0;

var faceSize = input[0].length < 100 ? 4 : 50;

var cube = {};

var mapX = -1;
var mapY = 0;

var map = input[0].split('\r\n').map(l => l.split(''));

for(var mx = 0; mx < map[0].length; mx++) {
    if (mapX == -1 && map[0][mx] == '.') {
        mapX = mx;
    }
}

function key(x, y, z) {
    return x+','+y+','+z;
}

function at(x, y, z) {
    return cube(key(x, y, z));
}

function turn(x, y, z, dx, dy, dz, lr) {
    var right = lr == 'R';
    var ps = [x, y, z];
    var ds = [dx, dy, dz];
    ps.forEach((p, pi) => {
        if (p == 0) {
            if (ds[(pi+1)%3] == 0) {
                ds[(pi+1)%3] = right ? -ds[(pi+2)%3] : ds[(pi+2)%3];
                ds[(pi+2)%3] = 0;
            } else {
                ds[(pi+2)%3] = right ? ds[(pi+1)%3] : -ds[(pi+1)%3];
                ds[(pi+1)%3] = 0;
            }
        }
        if (p == faceSize + 1) {
            if (ds[(pi+1)%3] == 0) {
                ds[(pi+1)%3] = right ? ds[(pi+2)%3] : -ds[(pi+2)%3];
                ds[(pi+2)%3] = 0;
            } else {
                ds[(pi+2)%3] = right ? -ds[(pi+1)%3] : ds[(pi+1)%3];
                ds[(pi+1)%3] = 0;
            }
        }
    })
    return {
        dx: ds[0],
        dy: ds[0],
        dz: ds[0]
    }
}

function next(x, y, z, dx, dy, dz) {
    var ps = [x, y, z];
    var ds = [dx, dy, dz];
    var nds = [dx, dy, dz];
    ds.forEach((d, di) => {
        if (d != 0) {
            if (ps[di] + d == 0 || (ps[i] + d > faceSize)) {
                for (var i = 0; i < 2; i++) {
                    switch (ps[(di+i)%3]) {
                        case 0:
                            nds[(di+i)%3] = 1;
                            nds[(di+i+1)%3] = 0;
                            nds[(di+i+2)%3] = 0;
                        break;
                        case faceSize+2:
                            nds[(di+i)%3] = -1;
                            nds[(di+i+1)%3] = 0;
                            nds[(di+i+2)%3] = 0;
                        break;
                    }
                }
            }
        }
    });

    var nx = ps[0] + ds[0] + nds[0];
    var ny = ps[1] + ds[1] + nds[1];
    var nz = ps[2] + ds[2] + nds[2];

    if (at(nx, ny, nz) == '#') {
        return {
            x: x,
            y: y,
            z: z,
            dx: dx,
            dy: dy,
            dz: dz
        };
    }

    return {
        x: nx,
        y: ny,
        z: nz,
        dx: nds[0],
        dy: nds[1],
        dz: nds[2]
    }
}


var regex = /(\d+)([RL]?)/g;

var directions = input[1].match(regex);

directions = directions.map(d => { 
    var turn = d.match(/([LR])/g);
    if (turn) {
        turn = turn[0];
    }
    return { 
        step: parseInt(d.match(/(\d+)/g)[0]),
        turn: turn || ''
    };
});



// directions.forEach(d => {
//     //step in current direction
//     var dx = angles[facing][0];
//     var dy = angles[facing][1];

//     for(var i = 0; i < d.step; i++) {
//         var next = next(xpos, ypos, dx, dy);
//         xpos = next.x;
//         ypos = next.y;
//     }

//     // turn
//     if (d.turn == 'R') {
//         facing = (facing + 1) % 4;
//     } 
//     if (d.turn == 'L') {
//         facing = (facing + 3) % 4;
//     }
// })



console.log((1000*(ypos+1)) + (4*(xpos+1)) + facing);