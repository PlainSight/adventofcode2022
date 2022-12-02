var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(i => i.split(' '));

// A for Rock, B for Paper, and C for Scissors
// X for Rock, Y for Paper, and Z for Scissors

var score = 0;

input.forEach(r => {
    var value = r[0].charCodeAt(0) - 'A'.charCodeAt(0);
    var response = r[1].charCodeAt(0) - 'X'.charCodeAt(0);

    // win
    if (((response + 2) % 3) == value) {
        score += 6;
    } else {
        if (response == value) {
            // draw
            score += 3;
        }
    }
    score += (response + 1);

});

console.log(score);
