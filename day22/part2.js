var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');


var cube = {};

var startXOffset = 1;
var mapX = -1;
var mapY = 0;

var map = input[0].split('\r\n').map(l => l.split(''));

var tileCount = map.map(l => l.filter(c => c != ' ').length).reduce((a, c) => a + c, 0);

var faceSize = Math.sqrt(tileCount/6);

for(var mx = 0; mx < map[0].length; mx++) {
    if (mapX == -1 && map[0][mx] == '#') {
        startXOffset++;
    }
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

function turn(v, lr) {
    var right = lr == 'R';
    var ps = [v.x, v.y, v.z];
    var ds = [v.dx, v.dy, v.dz];

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
    });

    return {
        x: v.x,
        y: v.y,
        z: v.z,
        dx: ds[0],
        dy: ds[1],
        dz: ds[2]
    }
}

function next(v, ignorewalls) {
    var ps = [v.x, v.y, v.z];
    var nds = [v.dx, v.dy, v.dz];
    var extra = [0, 0, 0];
    [v.dx, v.dy, v.dz].forEach((d, di) => {
        if (d != 0) {
            if ((ps[di] + d == 0) || (ps[di] + d == (faceSize + 1))) {
                extra[di] = d;
                // movement vector is now either up or down for the coordinate which was on the face
                nds = ps.map(p => {
                    return p == 0 ? 1 : (p == faceSize+1 ? -1 :0);
                });
            }
        }
    });

    var nx = ps[0] + extra[0] + nds[0];
    var ny = ps[1] + extra[1] + nds[1];
    var nz = ps[2] + extra[2] + nds[2];

    if (!ignorewalls && at(nx, ny, nz) == '#') {
        return v;
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
    cx: startXOffset,
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

    mapNeighbours.forEach((mn, imn) => {
        if (mn && !mapped[mn.x+','+mn.y]) {
            mapped[mn.x+','+mn.y] = true;
            var pos = {
                x: top.cx,
                y: top.cy,
                z: top.cz,
                dx: top.cdx,
                dy: top.cdy,
                dz: top.cdz,
            };
            for(var r = 0; r < imn; r++) {
                // rotate right
                pos = turn(pos, 'R');
            }
            // step forward (in same direction as on map)
            pos = next(pos);
            for(var l = 0; l < imn; l++) {
                // rotate left
                pos = turn(pos, 'L');
            }
            stack.push({
                x: mn.x,
                y: mn.y,
                cx: pos.x,
                cy: pos.y,
                cz: pos.z,
                cdx: pos.dx,
                cdy: pos.dy,
                cdz: pos.dz
            })
        }
    })
}



// facing right to start
var cubePos = {
    x: startXOffset,
    y: 1,
    z: 0,
    dx: 1,
    dy: 0,
    dz: 0
}

directions.forEach(d => {
    //step in current direction
    for(var i = 0; i < d.step; i++) {
        cubePos = next(cubePos);
    }

    // turn
    if (d.turn) {
        cubePos = turn(cubePos, d.turn);
    }
})


var mapCo = originalAt(cubePos.x, cubePos.y, cubePos.z);

var nextStep = next(cubePos, true);
var nextStepCo = originalAt(nextStep.x, nextStep.y, nextStep.z);

cubePos = turn(cubePos, 'L');
cubePos = turn(cubePos, 'L');

var priorStep = next(cubePos, true);
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