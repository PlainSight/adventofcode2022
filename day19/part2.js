var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var blueprints = [];

input.forEach(i => {
    var parts = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./.exec(i);

    blueprints.push({
        id: parseInt(parts[1]),
        costs: [
            [parseInt(parts[2]), 0, 0, 0], // ore bot
            [parseInt(parts[3]), 0, 0, 0], // clay bot
            [parseInt(parts[4]), parseInt(parts[5]), 0, 0], // obsidion bot
            [parseInt(parts[6]), 0, parseInt(parts[7]), 0] // geode bot
        ]
    });
});

// blueprint = 0-N

// state = oreRobot, clayRobot, obsidianRobot, GeodeRobot

// resource = ore, clay, obsidian, geode

function canAfford(blueprint, bot, resource) {
    return resource.filter((v, i) => v >= blueprints[blueprint].costs[bot][i]).length == 4;
}

function maxIncomeForResource(blueprint, r) {
    return Math.max(...blueprints[blueprint].costs.map(b => b[r]));
}

function subtractResource(blueprint, resource, spend) {
    var resourcesAfterSpend = resource.map(r => r);
    for(var r = 0; r < 3; r++) {
        for (var ps = 0; ps < 4; ps ++) {
            resourcesAfterSpend[r] -= (blueprints[blueprint].costs[ps][r] * spend[ps]);
        }
    }
    return resourcesAfterSpend;
}

var mostGeodesPerBlueprint = [];

var cache = {};

function key(state, resource, banned) {
    return state.join(',')+':'+resource.join(',')+':'+banned.join(',');
}

function explore(blueprint, state, resource, time, banned) {
    if (resource[3] + ((state[3]+1+Math.ceil(time/2))*time) < (mostGeodesPerBlueprint[blueprint] || 0)) {
        return;
    }

    if (time < (cache[key(state, resource, banned)] || 0)) {
        return;
    }

    cache[key(state, resource, banned)] = time;

    if (time == 0) {
        if (resource[3] > (mostGeodesPerBlueprint[blueprint])) {
            mostGeodesPerBlueprint[blueprint] = resource[3];
            //console.log(blueprint, resource[3], state, resource);
        }
        return;
    }

    var newResource = [];

    var builds = [];

    var canBuild = 0;

    var nullBuild = banned.map(m => m);

    if (canAfford(blueprint, 3, resource) && banned[3] == 0) {
        canBuild++;
        builds.push([0, 0, 0, 1]);
        nullBuild[3] = 1;
    }
    if (canAfford(blueprint, 2, resource) && (state[2] < maxIncomeForResource(blueprint, 2)) && banned[2] == 0) {
        canBuild++;
        builds.push([0, 0, 1, 0]);
        nullBuild[2] = 1;
    }
    if (canAfford(blueprint, 1, resource) && (state[1] < maxIncomeForResource(blueprint, 1)) && banned[1] == 0) {
        canBuild++;
        builds.push([0, 1, 0, 0]);
        nullBuild[1] = 1;
    }
    if (canAfford(blueprint, 0, resource) && (state[0] < maxIncomeForResource(blueprint, 0)) && banned[0] == 0) {
        canBuild++;
        builds.push([1, 0, 0, 0]);
        nullBuild[0] = 1;
    }

    for(var i = 0; i < 4; i++) {
        newResource[i] = resource[i] + state[i];
    }

    builds.forEach(b => {
        explore(blueprint, state.map((s, i) => s + b[i]), subtractResource(blueprint, newResource, b), time-1, [0, 0, 0, 0]);
    });

    if (canBuild < 4) {
        explore(blueprint, state.map(s => s), newResource.map(r => r), time-1, nullBuild);
    }
}

for(var b = 0; b < 3; b++) {
    cache = {};
    mostGeodesPerBlueprint[b] = 0;
    explore(b, [1, 0, 0, 0], [0, 0, 0, 0], 32, [0, 0, 0, 0]);
}

console.log(mostGeodesPerBlueprint.reduce((a, c) => a * c, 1));