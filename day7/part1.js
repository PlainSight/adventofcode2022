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

var small = 0;


function explore(dir) {
    var size = 0;
    dir.children.forEach(d => {
        if (d.size) {
            size += d.size;
        } else {
            var s = explore(d);
            d.size = s;
            if (s <= 100000) {
                small += s;
            }
            size += s;
        }
    });
    return size;
}

explore(root);

console.log(small);