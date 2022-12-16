var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var valves = {};

input.forEach(i => {
    var parts = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z\, ]+)/.exec(i);

    var tunnels = parts[3].split(', ');
    
    valves[parts[1]] = {
        rate: parseInt(parts[2]),
        tunnels: tunnels
    }
});

var highestScore = 0;

function key(position, time, open) {
    return position+':'+time+':'+Object.keys(open).sort((a, b) => b - a).join('-');
}

var states = {};

function search(position, open, time, score) {
    var newScore = Object.keys(open).map(k => valves[k].rate).reduce((a, c) => a + c, score);

    var k = key(position, time, open);
    var cachedScore = states[k] || 0;
    if (time < 25 && newScore <= cachedScore) {
        return;
    } else {
        states[k] = newScore
    }

    if (time == 0) {
        // check score
        if (newScore > highestScore) {
            highestScore = newScore;
            console.log(highestScore);
        }
        return;
    }

    //options, open, or move
    
    var state = open[position];
    var rate = valves[position].rate;
    var tunnels = valves[position].tunnels;

    var moves = tunnels.map(t => { return { move: t }; }).sort((a, b) => open[a] ? 1 : -1);
    if (!state && rate > 0) {
        moves.push({ move: 'open' });
    }

    moves.forEach(m => {
        var openClone = JSON.parse(JSON.stringify(open));
        if (m.move == 'open') {
            openClone[position] = true;
            search(position, openClone, time-1, newScore);
        } else {
            search(m.move, openClone, time-1, newScore);
        }
    })
}

search('AA', {}, 29, 0);

console.log(highestScore);