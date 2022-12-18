var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var grid = {};

var min = [Infinity, Infinity, Infinity];
var max = [-Infinity, -Infinity, -Infinity];

var diffs = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];

input.forEach(i => {
    grid[i] = 'rock';

    var coords = i.split(',').map(n => parseInt(n));

    diffs.forEach(d => {
        var x = coords[0]+d[0];
        var y = coords[1]+d[1];
        var z = coords[2]+d[2];

        min[0] = min[0] > x ? x : min[0];
        max[0] = max[0] < x ? x : max[0];
        min[1] = min[1] > y ? y : min[1];
        max[1] = max[1] < y ? y : max[1];
        min[2] = min[2] > z ? z : min[2];
        max[2] = max[2] < z ? z : max[2];

        var key = (x)+','+(y)+','+(z);
        if (!grid[key]) {
            grid[key] = 'surface';
        }
    })
});

for (var x = min[0]; x <= max[0]; x++) {
    for (var y = min[1]; y <= max[1]; y++) {
        for (var z = min[2]; z <= max[2]; z++) {
            if(!grid[x+','+y+','+z]) {
                grid[x+','+y+','+z] = 'air';
            }
        }
    }
}

var stack = [];

function flood(k) {
    var value = grid[k];

    switch (value) {
        case 'surface':
            grid[k] = 'outersurface';
        break;
        case 'air':
            grid[k] = 'checkedair';
        break;
    }

    var coords = k.split(',').map(n => parseInt(n));

    diffs.forEach(d => {
        var x = coords[0]+d[0];
        var y = coords[1]+d[1];
        var z = coords[2]+d[2];

        if (!(x < min[0] || x > max[0] || y < min[1] || y > max[1] || z < min[2] || z > max[2])) {
            var key = (x)+','+(y)+','+(z);
            if (grid[key] == 'surface' || grid[key] == 'air') {
                stack.push(key);
            }
        }
    });
}

flood('0,0,0');

while(stack.length) {
    flood(stack.pop());
}

var count = 0;

Object.keys(grid).forEach(k => {
    var value = grid[k];

    if (value != 'outersurface') {
        return;
    }

    var coords = k.split(',').map(n => parseInt(n));

    diffs.forEach(d => {
        var x = coords[0]+d[0];
        var y = coords[1]+d[1];
        var z = coords[2]+d[2];

        var key = (x)+','+(y)+','+(z);
        if (grid[key] == 'rock') {
            count++;
        }
    })
})

console.log(count);