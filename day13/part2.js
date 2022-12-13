var fs = require('fs');

var all = fs.readFileSync('./input.txt', 'utf8').split('\r\n').filter(l => l != '');

var div1 = '[[2]]';
var div2 = '[[6]]';

all.push(div1);
all.push(div2);

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

all.sort((a, b) => {
    var a1 = JSON.parse(a);
    var b1 = JSON.parse(b);

    return compare(b1, a1);
})

var val = (all.indexOf(div1)+1)*(all.indexOf(div2)+1);

console.log(val);