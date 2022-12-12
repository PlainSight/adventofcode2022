var fs = require('fs');

var target = {};
var starts = [];

var grid = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map((l, y) => l.split('').map((e, x) => {
    if (e == 'E') {
        target.x = x;
        target.y = y;
        return { elevation: 25 };
    } else {
        if (e == 'S' || e == 'a') {
            starts.push({
                x: x,
                y: y,
                dist: 0
            });
            return { elevation: 0 };
        } else {
            var elevation = e.charCodeAt(0) - 'a'.charCodeAt(0);
            return { elevation: elevation };
        }
    }
}));

var distances = starts.map(start => {
    var seen = {
    
    };
    
    seen[start.x+','+start.y] = true;
    
    var stack = [
        start
    ];
    
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
                if (grid[yy][xx].elevation <= grid[n.y][n.x].elevation + 1 && !seen[xx+','+yy]) {
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
    
        if (top.x == target.x && top.y == target.y) {
            return top.dist;
        }
    
        var neighbours = validNeighbours(top);
        stack.push(...neighbours);
    }

    return Infinity;
})

console.log(Math.min(...distances));