var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');


var cube = {};

var mapX = -1;
var mapY = 0;

var map = input[0].split('\r\n').map(l => l.split(''));

var tileCount = map.map(l => l.filter(c => c != ' ').length).reduce((a, c) => a + c, 0);

var faceSize = Math.sqrt(tileCount/6);

for(var mx = 0; mx < map[0].length; mx++) {
    if (mapX == -1 && map[0][mx] == '.') {
        mapX = mx;
    }
}

function key(x, y, z) {
    return x+','+y+','+z;
}

function originalAt(x, y, z) {
    var val = cube[key(x, y, z)];
    if (val) {
        return val;
    }
    return null;
}

function at(x, y, z) {
    var val = cube[key(x, y, z)];
    if (val) {
        return val.o;
    }
    return '';
}

function set(x, y, z, ox, oy, o) {
    cube[key(x, y, z)] = {
        ox: ox,
        oy: oy,
        o: o
    };
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
        if (p == (faceSize + 1)) {
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
        dy: ds[1],
        dz: ds[2]
    }
}

function next(x, y, z, dx, dy, dz, ignorewalls) {
    var ps = [x, y, z];
    var ds = [dx, dy, dz];
    var nds = [dx, dy, dz];
    var extra = [0, 0, 0];
    ds.forEach((d, di) => {
        if (d != 0) {
            if ((ps[di] + d == 0) || (ps[di] + d == (faceSize + 1))) {
                //console.log('edge', d, di);
                extra[di] = d;
                for (var i = 0; i < 3; i++) {
                    switch (ps[(di+i)%3]) {
                        case 0:
                            //console.log('cond s', (di+i)%3);
                            nds[(di+i)%3] = 1;
                            nds[(di+i+1)%3] = 0;
                            nds[(di+i+2)%3] = 0;
                        break;
                        case faceSize+1:
                            //console.log('cond b', (di+i)%3);
                            nds[(di+i)%3] = -1;
                            nds[(di+i+1)%3] = 0;
                            nds[(di+i+2)%3] = 0;
                        break;
                    }
                }
            }
        }
    });

    var nx = ps[0] + extra[0] + nds[0];
    var ny = ps[1] + extra[1] + nds[1];
    var nz = ps[2] + extra[2] + nds[2];

    if (!ignorewalls && at(nx, ny, nz) == '#') {
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

var mapped = {};

// stack always has right facing elements
var stack = [{
    x: mapX,
    y: mapY,
    cx: 1,
    cy: 1,
    cz: 0,
    cdx: 1,
    cdy: 0,
    cdz: 0
}];

mapped[mapX+','+mapY] = true;

function validMapNeighbours(x, y) {
    return [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ].map(d => {
        var nx = x + d[0];
        var ny = y + d[1];
        if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length) {
            if (map[ny][nx] == '#' || map[ny][nx] == '.') {
                return {
                    x: nx,
                    y: ny
                }
            }
        }
        return null;
    });
}

while(stack.length) {
    var top = stack.pop();

    set(top.cx, top.cy, top.cz, top.x, top.y, map[top.y][top.x]);

    var mapNeighbours = validMapNeighbours(top.x, top.y);

    //console.log('top', top);

    mapNeighbours.forEach((mn, imn) => {
        if (mn && !mapped[mn.x+','+mn.y]) {
            mapped[mn.x+','+mn.y] = true;
            var cdx = top.cdx;
            var cdy = top.cdy;
            var cdz = top.cdz;
            for(var r = 0; r < imn; r++) {
                // rotate right
                var newDir = turn(top.cx, top.cy, top.cz, cdx, cdy, cdz, 'R');
                cdx = newDir.dx;
                cdy = newDir.dy;
                cdz = newDir.dz;
            }
            //console.log('searching', r, ':', top.cx, top.cy, top.cz, cdx, cdy, cdz);
            var newPos = next(top.cx, top.cy, top.cz, cdx, cdy, cdz);
            cdx = newPos.dx;
            cdy = newPos.dy;
            cdz = newPos.dz;
            //console.log('found', newPos)
            for(var l = 0; l < imn; l++) {
                // rotate left
                var newDir = turn(newPos.x, newPos.y, newPos.z, cdx, cdy, cdz, 'L');
                cdx = newDir.dx;
                cdy = newDir.dy;
                cdz = newDir.dz;
            }
            stack.push({
                x: mn.x,
                y: mn.y,
                cx: newPos.x,
                cy: newPos.y,
                cz: newPos.z,
                cdx: cdx,
                cdy: cdy,
                cdz: cdz
            })
        }
    })
}

var cubeX = 1;
var cubeY = 1;
var cubeZ = 0;

// facing right to start

var cubeDX = 1;
var cubeDY = 0;
var cubeDZ = 0;

directions.forEach(d => {
    //step in current direction
    for(var i = 0; i < d.step; i++) {
        var n = next(cubeX, cubeY, cubeZ, cubeDX, cubeDY, cubeDZ);
        cubeX = n.x;
        cubeY = n.y;
        cubeZ = n.z;
        cubeDX = n.dx;
        cubeDY = n.dy;
        cubeDZ = n.dz;
    }

    // turn
    if (d.turn) {
        var t = turn(cubeX, cubeY, cubeZ, cubeDX, cubeDY, cubeDZ, d.turn);
        cubeDX = t.dx;
        cubeDY = t.dy;
        cubeDZ = t.dz;
    }
})


var mapCo = originalAt(cubeX, cubeY, cubeZ);

var nextStep = next(cubeX, cubeY, cubeZ, cubeDX, cubeDY, cubeDZ, true);
var nextStepCo = originalAt(nextStep.x, nextStep.y, nextStep.z);

var priorStep = next(cubeX, cubeY, cubeZ, -cubeDX, -cubeDY, -cubeDZ, true);
var priorStepCo = originalAt(priorStep.x, priorStep.y, priorStep.z);

var nx = nextStepCo.ox - mapCo.ox;
var ny = nextStepCo.oy - mapCo.oy;

var px = mapCo.ox - priorStepCo.ox;
var py = mapCo.oy - priorStepCo.oy;

var dx = 0;
var dy = 0;

if (Math.abs(nx) + Math.abs(ny) < 2) {
    dx = nx;
    dy = ny;
} else {
    dx = px;
    dy = py;
}

var facing = 0;

if (dx == -1) {
    facing = 2;
}
if (dy == -1) {
    facing = 3;
}
if (dy == 1) {
    facing = 1;
}

console.log((1000*(mapCo.oy+1)) + (4*(mapCo.ox+1)) + facing);