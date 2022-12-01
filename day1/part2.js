var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n').map(g => g.split('\r\n').map(n => parseInt(n)));

var ordered = input.map(g => g.reduce((a, b) => a + b, 0)).sort((a, b) => b - a);

console.log(ordered[0]+ordered[1]+ordered[2]);