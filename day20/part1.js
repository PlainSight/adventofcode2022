var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => parseInt(n));

var previousNode = null;
var startNode = null;

var uniqueNodeReferences = [];
var nodeZero = null;

for(var i = 0; i < input.length; i++) {
    var newNode = {
        value: input[i],
        next: null,
        last: previousNode,
    };
    if (previousNode) {
        previousNode.next = newNode;
    }
    if (i == 0) {
        startNode = newNode;
    }
    if (i == input.length-1) {
        newNode.next = startNode;
        startNode.last = newNode;
    }
    if (input[i] == 0) {
        nodeZero = newNode;
    }
    previousNode = newNode;
    uniqueNodeReferences.push(newNode);
}

function mix(node, direction, stepsRemaining) {
    for(var s = 0; s < stepsRemaining; s++) {
        if (direction > 0) {
            // move next
            var nn = node.next;
            var nnn = nn.next;
            var ln = node.last;

            nnn.last = node;
            node.next = nnn;
            node.last = nn;
    
            nn.next = node;
            nn.last = ln;
            ln.next = nn;
        } else {
            // move last
            var ln = node.last;
            var lln = ln.last;
            var nn = node.next;
    
            lln.next = node;
            node.last = lln;
            node.next = ln;
    
            ln.last = node;
            ln.next = nn;
            nn.last = ln;
        }
    }
}

var currentNode = nodeZero;

uniqueNodeReferences.forEach(n => {
    mix(n, (n.value < 0 ? -1 : 1), Math.abs(n.value));
})

var sum = 0;

currentNode = nodeZero;

for(var i = 0; i < uniqueNodeReferences.length; i++) {
    currentNode = currentNode.next;
}

currentNode = nodeZero;

for(var i = 0; i <= 3000; i++) {
    if (i % 1000 == 0) {
        sum += currentNode.value;
    }
    currentNode = currentNode.next;
}

console.log(sum);