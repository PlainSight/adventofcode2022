var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var grid = {};

input.forEach(i => {
    grid[i] = true;
});

var count = 0;

Object.keys(grid).forEach(k => {
    var coords = k.split(',').map(n => parseInt(n));

    var diffs = [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ];

    diffs.forEach(d => {
        var key = (coords[0]+d[0])+','+(coords[1]+d[1])+','+(coords[2]+d[2]);
        if (!grid[key]) {
            count++;
        }
    })
})

console.log(count);