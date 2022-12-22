var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var xpos = -1;
var ypos = 0;
var facing = 0;

var angles = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

// facing increase = turn right, facing decrease = turn left

var map = input[0].split('\r\n').map((l, li) => l.split('').map((c, ci) => {
    if (li == 0 && c == '.' && xpos == -1) {
        xpos = ci;
    }
    return c;
}));

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

function nextPos(x, y, dx, dy) {
    var ny = (y + dy + map.length) % map.length;
    var nx = (x + dx + map[y].length) % map[y].length;
    while (map[ny][nx] != '.' && map[ny][nx] != '#') {
        // wrap
        ny = (ny + dy + map.length) % map.length;
        nx = (nx + dx + map[y].length) % map[y].length;
    }
    if (dy != 0 && nx != x) {
        console.log('WTFx');
    }
    if(map[ny][nx] == '#') {
        return {
            x: x,
            y: y
        };
    }
    return {
        x: nx,
        y: ny
    };
}

console.log(xpos, ypos, facing);

directions.forEach(d => {
    //step in current direction
    var dx = angles[facing][0];
    var dy = angles[facing][1];

    for(var i = 0; i < d.step; i++) {
        var next = nextPos(xpos, ypos, dx, dy);
        xpos = next.x;
        ypos = next.y;
    }

    // turn
    if (d.turn == 'R') {
        facing = (facing + 1) % 4;
    } 
    if (d.turn == 'L') {
        facing = (facing + 3) % 4;
    }
})

console.log(ypos, xpos, facing);

console.log((1000*(ypos+1)) + (4*(xpos+1)) + facing);