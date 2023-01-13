var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var valves = {};
var valvesArray = [];


var valveBitIndex = 0;

input.forEach(i => {
    var parts = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z\, ]+)/.exec(i);

    var tunnels = parts[3].split(', ');

    var rate = parseInt(parts[2]);
    
    var valve = {
        name: parts[1],
        rate: rate,
        tunnels: tunnels,
        bitIndex: rate > 0 ? valveBitIndex++ : -1
    };

    valvesArray.push(valve);

    valves[parts[1]] = valve;
});

var targetValves = valvesArray.filter(va => va.rate > 0);

var highestScore = 0;

var maxRate = targetValves.reduce((a, c) => a + c.rate, 0);

var states = {};

function getTargets(open, loc) {
    var targets = targetValves.filter(v => (((open >> v.bitIndex) & 1) == 0));
    targets.sort((a, b) => pathCache[loc+a.name].distance - pathCache[loc+b.name].distance);
    return targets.slice(0, Math.max(1, targets.length / 2.5));   // may fail for some inputs ?
}

var pathCache = {};

targetValves.forEach(v => {
    var closedSet = {};
    var pathQueue = [{n: v.name, d: 0}];
    closedSet[v.name] = { name: v.name, distance: 0 };

    while(pathQueue.length) {
        var first = pathQueue.shift();

        valves[first.n].tunnels.forEach(t => {
            if (!closedSet[t]) {
                pathQueue.push({
                    n: t,
                    d: first.d+1
                })
                closedSet[t] = { name: first.n, distance: first.d+1 };
            }
        });
    }

    Object.entries(closedSet).forEach(e => {
        if (e[1] != e[0]) {
            pathCache[e[0]+v.name] = e[1];
        }
    })
})

function getNextMoveToTarget(current, target) {
    return pathCache[current+target].name;
}

function key(position, elephant, time, open) {
    if (position > elephant) {
        return position+elephant+time+':'+open;
    }
    return elephant+position+time+':'+open;
}

function search(position, pt, elephant, et, open, time, score) {
    var newScore = targetValves.filter(v => (((open >> v.bitIndex) & 1) == 1)).reduce((a, c) => a + c.rate, score);

    if (newScore + time*maxRate <= highestScore) {
        return;
    }

    var k = key(position, elephant, time, open);
    var cachedScore = states[k] || 0;
    if (newScore+1 < cachedScore) {
        return;
    } else {
        states[k] =  newScore+1;
    }

    if (time == 0) {
        // check score
        if (newScore > highestScore) {
            highestScore = newScore;
            console.log(highestScore, k);
        }
        return;
    }

    var pmoves = [];

    if (position == pt && valves[position].rate > 0 && (((open >> valves[position].bitIndex) & 1) == 0)) {
        // open
        pmoves.push({ type: 'open' });
    } else {
        // if not on target move to it
        if (position != pt) {
            var next = getNextMoveToTarget(position, pt);
            pmoves.push({ type: 'move', value: next });
        } else {
            // get new target and
            pmoves.push(...getTargets(open, position).map(t => {
                return {
                    type: 'path',
                    dest: t.name,
                    value: getNextMoveToTarget(position, t.name)
                }
            }));
        }
    }

    if (pmoves.length == 0) {
        pmoves.push({ type: 'chill' })
    }

    var emoves = [];

    if (elephant == et && valves[elephant].rate > 0 && (((open >> valves[elephant].bitIndex) & 1) == 0)) {
        // open
        emoves.push({ type: 'open' });
    } else {
        if (elephant != et) {
            var next = getNextMoveToTarget(elephant, et);
            emoves.push({ type: 'move', value: next });
        } else {
            // get new target
            emoves.push(...getTargets(open, elephant).map(t => {
                return {
                    type: 'path',
                    dest: t.name,
                    value: getNextMoveToTarget(elephant, t.name)
                }
            }));
        }
    }

    if (emoves.length == 0) {
        emoves.push({ type: 'chill' });
    }

    emoves.forEach(em => {
        pmoves.forEach(m => {
            var openClone = open;

            var pos = position;
            var ptar = pt;

            switch(m.type) {
                case 'open':
                    openClone = openClone | (1 << valves[position].bitIndex);
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
                    openClone = openClone | (1 << valves[elephant].bitIndex);
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

search('AA', 'AA', 'AA', 'AA', 0, 25, 0);

console.log(highestScore);