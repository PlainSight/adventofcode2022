var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var root = {
    name: '/',
    children: [],
    parent: null
};
var currentDirectory = root;

input.forEach(i => {
    var parts = i.split(' ');
    switch (parts[0]) {
        case '$':
            {
                switch (parts[1]) {
                    case 'cd':
                        if (parts[2] == '/') {
                            currentDirectory = root;
                        } else {
                            if (parts[2] == '..') {
                                currentDirectory = currentDirectory.parent;
                            } else {
                                currentDirectory = currentDirectory.children.filter(cd => cd.name == parts[2])[0];
                            }
                        }
                        break;
                    case 'ls':
                        break;
                }
            }
        break;
        case 'dir':
            currentDirectory.children.push({ 
                name: parts[1], 
                children: [],
                parent: currentDirectory,
            });
        break;
        default:
            currentDirectory.children.push({
                name: parts[1],
                size: parseInt(parts[0]),
                parent: currentDirectory
            });
        break;
    }
});

var toDelete = [];


function explore(dir) {
    var size = 0;
    dir.children.forEach(d => {
        if (d.size) {
            size += d.size;
        } else {
            var s = explore(d);
            d.size = s;
            toDelete.push({
                name: d.name,
                size: s
            });
            size += s;
        }
    });
    return size;
}

root.size = explore(root);

toDelete.sort((a,b) => b-a);

var result = Infinity;

toDelete.forEach(c => {
    if (70000000 - root.size + c.size > 30000000) {
        if (c.size < result) {
            result = c.size;
        }
    }
})

console.log(result);