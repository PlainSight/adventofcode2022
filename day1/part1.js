var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n').map(g => g.split('\r\n').map(n => parseInt(n)));

var most = Math.max(...input.map(g => g.reduce((a, b) => a + b, 0)));

console.log(most);