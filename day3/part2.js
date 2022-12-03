var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

input.reduce((a, c, i) => { a[Math.floor(i/3)] = a[Math.floor(i/3)] || []; a[Math.floor(i/3)].push(c); return a; }, []).map(i => {
    var counts = {};
    i[0].split('').forEach(n => { counts[n] = counts[n] || 0; counts[n] = counts[n] | 1; });
    i[1].split('').forEach(n => { counts[n] = counts[n] || 0; counts[n] = counts[n] | 2; });
    i[2].split('').forEach(n => { counts[n] = counts[n] || 0; counts[n] = counts[n] | 4; });
    var entry = Object.entries(counts).filter(e => e[1] == 7);
    var dupe = entry[0][0];
    if (dupe.toLowerCase() == dupe) {
        sum += dupe.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else {
        sum += dupe.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }
})

console.log(sum);
