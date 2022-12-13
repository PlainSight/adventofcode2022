var fs = require('fs');

var pairs = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var correct = 0;

function compare(l, r) {
    if (!Array.isArray(l) && !Array.isArray(r)) {
        return l < r ? 1 : (r < l ? -1 : 0);
    } else {
        if (Array.isArray(l) && Array.isArray(r)) {
            for(var i = 0; i < l.length && i < r.length; i++) {
                var res = compare(l[i], r[i]);
                if (res != 0) {
                    return res;
                }
            }
            if (l.length < r.length) {
                return 1;
            } else {
                if (r.length < l.length) {
                    return -1;
                } else {
                    return 0;
                }
            }
        } else {
            if (Array.isArray(l)) {
                return compare(l, [r])
            } else {
                return compare([l], r)
            }
        }
    }
}

pairs.forEach((p, index) => {
    var ps = p.split('\r\n');
    var p1 = JSON.parse(ps[0]);
    var p2 = JSON.parse(ps[1]);

    if (compare(p1, p2) == 1) {
        correct += (index+1);
    }
})

console.log(correct);