var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

var most = input.map(i => {
    var dupe = null;
    var first = i.slice(0, i.length / 2).split('').reduce((a, c) => { a[c] = true; return a}, {});
    i.slice(i.length / 2).split('').forEach(n => { if (first[n]) { dupe = n } });
    if (dupe.toLowerCase() == dupe) {
        sum += dupe.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else {
        sum += dupe.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }
})

console.log(sum);
