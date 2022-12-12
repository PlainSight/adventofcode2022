var fs = require('fs');

var start = {};
var ends = {};

var grid = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map((l, y) => l.split('').map((e, x) => {
    if (e == 'E') {
        start.x = x;
        start.y = y;
        start.dist = 0;
        return { elevation: 25 };
    } else {
        if (e == 'S' || e == 'a') {
            ends[x+','+y] = true;
            return { elevation: 0 };
        } else {
            var elevation = e.charCodeAt(0) - 'a'.charCodeAt(0);
            return { elevation: elevation };
        }
    }
}));

var seen = {

};

seen[start.x+','+start.y] = true;

var stack = [
    start
];

distances = [];

function validNeighbours(n) {
    var valid = [];

    var d = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]];

    d.forEach(d => {
        var xx = n.x + d[0];
        var yy = n.y + d[1];

        if (xx >= 0 && xx < grid[0].length && yy >= 0 && yy < grid.length) {
            if (grid[yy][xx].elevation + 1 >= grid[n.y][n.x].elevation && !seen[xx+','+yy]) {
                valid.push({
                    x: xx,
                    y: yy,
                    dist: n.dist + 1
                })
                seen[xx+','+yy] = true;
            }
        }
    })

    return valid;
}

while(stack.length) {
    //console.log(stack);
    stack.sort((a, b) => b.dist - a.dist);
    var top = stack.pop();

    if (ends[top.x+','+top.y]) {
        distances.push(top.dist);
    }

    var neighbours = validNeighbours(top);
    stack.push(...neighbours);
}

console.log(Math.min(...distances));