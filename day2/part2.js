var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(i => i.split(' '));

// A for Rock, B for Paper, and C for Scissors
// X for Rock, Y for Paper, and Z for Scissors

var score = 0;

input.forEach(r => {
    var value = r[0].charCodeAt(0) - 'A'.charCodeAt(0);

    var response = 0;

    switch (r[1]) {
        case 'X':
            response = (value + 2) % 3;
            break;
        case 'Y':
            response = value;
            break;
        case 'Z':
            response = (value + 1) % 3;
            break;
    }

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
