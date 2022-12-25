var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

function fromSnafu(n) {
    var len = n.length;
    var split = n.split('');

    var digits = ['2', '1', '0', '-', '='];

    var result = 0;

    for(var i = 0; i < len; i++) {
        var value = 2 - digits.indexOf(split[i]);

        var multiply = Math.pow(5, len - 1 - i);

        result += (value*multiply);
    }

    return result;
}

function toSnafu(d) {
    var length = 1;

    function highestNumberOfLength(l) {
        var sum = 0;
        for(var i = 0; i < l; i++) {
            sum += (2*Math.pow(5, i));
        }
        return sum;
    }

    function lowestNumberOfLength(l) {
        var sum = 0;
        for(var i = 0; i < l; i++) {
            sum -= (2*Math.pow(5, i));
        }
        return sum;
    }

    while (highestNumberOfLength(length) < d) {
        length++;
    }

    function selectBestValue(place, remainingValue) {
        if (place < 0) {
            return null;
        }

        var symbols = ['2', '1', '0', '-', '='];
        var symbolValues = [2, 1, 0, -1, -2];


        for(var si = 0; si < symbolValues.length; si++) {
            var s = symbolValues[si];
            var valueAfterSymbol = remainingValue - (s * Math.pow(5, place));

            if (valueAfterSymbol <= highestNumberOfLength(place) && valueAfterSymbol >= lowestNumberOfLength(place)) {
                if (place == 0) {
                    return symbols[si];
                }

                var rr = selectBestValue(place-1, valueAfterSymbol);
                if (rr != null) {
                    return symbols[si] + rr;
                }
            }
        }

        return null;
    }

    var string = selectBestValue(length-1, d);

    return string;
}

var sum = 0;

input.forEach(i => {
    var v = fromSnafu(i)
    sum += v;
})

console.log(toSnafu(sum));