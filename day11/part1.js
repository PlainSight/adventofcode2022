var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var monkeys = input.map(i => {
    var rows = i.split('\r\n');
    var items = /Starting items: ([0-9, ]+)/.exec(rows[1])[1].split(',').map(n => parseInt(n));
    var op = /Operation: new = old (.) (.+)/.exec(rows[2]);
    var operation = op[1];
    var operationValue = op[2];
    var test = parseInt(/Test: divisible by (\d+)/.exec(rows[3])[1]);
    var ifTrue = parseInt(/If true: throw to monkey (\d+)/.exec(rows[4])[1]);
    var ifFalse = parseInt(/If false: throw to monkey (\d+)/.exec(rows[5])[1]);

    return {
        items, operation, operationValue, test, ifTrue, ifFalse, inspections: 0
    }
})

for (var round = 0; round < 20; round++) {
    monkeys.forEach(m => {
        while (m.items.length) {
            var item = m.items.pop();
            var opValue = m.operationValue;
            if (opValue == 'old') {
                opValue = item;
            } else {
                opValue = parseInt(opValue);
            }
            switch(m.operation) {
                case '+':
                    item += opValue;
                    break;
                case '*':
                    item *= opValue;
                    break;
            }
            item = Math.floor(item / 3);
            var testResult = item % m.test == 0;
            if (testResult) {
                monkeys[m.ifTrue].items.push(item);
            } else {
                monkeys[m.ifFalse].items.push(item);
            }
            m.inspections++;
        }
    });
}

monkeys.sort((a, b) => b.inspections - a.inspections);

console.log(monkeys[0].inspections * monkeys[1].inspections);