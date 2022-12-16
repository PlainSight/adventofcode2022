var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var valves = {};

input.forEach(i => {
    var parts = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z\, ]+)/.exec(i);

    var tunnels = parts[3].split(', ');
    
    valves[parts[1]] = {
        name: parts[1],
        rate: parseInt(parts[2]),
        tunnels: tunnels
    }
});

var highestScore = 0;

var states = {};

function getTargets(open) {
    var targets = Object.keys(valves).filter(v => !open[v] && valves[v].rate > 0);
    return targets;
}

var pathCache = {};

Object.values(valves).forEach(v => {
    var closedSet = {};
    var pathQueue = [{n: v.name, d: 0}];
    closedSet[v.name] = v.name;

    while(pathQueue.length) {
        var first = pathQueue.shift();

        valves[first.n].tunnels.forEach(t => {
            if (!closedSet[t]) {
                pathQueue.push({
                    n: t,
                    d: first.d+1
                })
                closedSet[t] = first.n;
            }
        });
    }

    Object.entries(closedSet).forEach(e => {
        if (e[1] != e[0]) {
            pathCache[e[0]+':'+v.name] = e[1];
        }
    })
})

function getNextMoveToTarget(current, target) {
    return pathCache[current+':'+target];
}

function key(position, elephant, time, open) {
    return position+':'+elephant+':'+time+':'+Object.keys(open).sort().join('-');
}

function search(position, pt, elephant, et, open, time, score) {
    var newScore = Object.keys(open).map(k => valves[k].rate).reduce((a, c) => a + c, score);

    var k = key(position, elephant, time, open);
    var cachedScore = states[k] || 0;
    if (newScore < cachedScore.s) {
        return;
    } else {
        states[k] =  { s: newScore }
    }

    if (time == 0) {
        // check score
        if (newScore > highestScore) {
            highestScore = newScore;
            console.log(highestScore);
        }
        return;
    }

    var pmoves = [];

    if (position == pt && !open[position] && valves[position].rate > 0) {
        // open
        pmoves.push({ type: 'open' });
    } else {
        // if not on target move to it
        if (position != pt) {
            var next = getNextMoveToTarget(position, pt);
            pmoves.push({ type: 'move', value: next });
        } else {
            // get new target and
            pmoves.push(...getTargets(open).map(t => {
                return {
                    type: 'path',
                    dest: t,
                    value: getNextMoveToTarget(position, t)
                }
            }));
        }
    }

    if (pmoves.length == 0) {
        pmoves.push({ type: 'chill' })
    }

    var emoves = [];

    if (elephant == et && !open[elephant] && valves[elephant].rate > 0) {
        // open
        emoves.push({ type: 'open' });
    } else {
        if (elephant != et) {
            var next = getNextMoveToTarget(elephant, et);
            emoves.push({ type: 'move', value: next });
        } else {
            // get new target
            emoves.push(...getTargets(open).map(t => {
                return {
                    type: 'path',
                    dest: t,
                    value: getNextMoveToTarget(elephant, t)
                }
            }));
        }
    }

    if (emoves.length == 0) {
        emoves.push({ type: 'chill' });
    }

    emoves.forEach(em => {
        pmoves.forEach(m => {
            var openClone = JSON.parse(JSON.stringify(open));

            var pos = position;
            var ptar = pt;

            switch(m.type) {
                case 'open':
                    openClone[position] = true;
                break;
                case 'move':
                    pos = m.value
                break;
                case 'path':
                    ptar = m.dest;
                    pos = m.value;
                break;
            }

            var epos = elephant;
            var etar = et;

            switch(em.type) {
                case 'open':
                    openClone[elephant] = true;
                break;
                case 'move':
                    epos = em.value
                break;
                case 'path':
                    etar = em.dest;
                    epos = em.value;
                break;
            }

            if (etar != ptar && !(em.type == 'open' && m.type == 'open' && epos == pos)) {
                search(pos, ptar, epos, etar, openClone, time-1, newScore);
            }
        })
    })
}

search('AA', 'AA', 'AA', 'AA', {}, 25, 0);

console.log(highestScore);