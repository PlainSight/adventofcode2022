var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var count = 0;

input.forEach(i => {
    var ranges = i.split(',').map(n => n.split('-').map(x => parseInt(x)));

    if (ranges[0][1] <= ranges[1][1] && ranges[0][0] >= ranges[1][0]) {
        count++;
    } else {
        if (ranges[1][1] <= ranges[0][1] && ranges[1][0] >= ranges[0][0]) {
            count++;
        }
    }
})

console.log(count);