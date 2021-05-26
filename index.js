const midi = require('midi');

const input = new midi.input();
const output = new midi.output();

for (let i = 0; i < input.getPortCount(); i++) {
    console.log(input.getPortName(i));
}

for (let i = 0; i < output.getPortCount(); i++) {
    console.log(output.getPortName(i));
}

let count = [];
let dtcount = [];
let q = [];

setInterval(() => {
    console.log('test');
}, 10);

input.on('message', (dt, msg) => {
    if (typeof count[msg[0]] == 'undefined') count[msg[0]] = 0;
    dtcount[msg[0]] = dt;
    q[msg[0]] = 50;

    if (dtcount[msg[0]] < 0.01) {
        if (msg[2] !== 0) count[msg[0]]++;
        q[msg[0]] *= .75;
    } else {
        count[msg[0]] = 0;
    }

    console.log(msg[1] + ": " + count[msg[0]]);
    if (count[msg[0]] < q[msg[0]] && msg[2] !== 0) {
        output.sendMessage(msg);
    } else if (msg[2] == 0) {
        output.sendMessage(msg);
    }
});

input.openPort(0);
output.openPort(3);

input.ignoreTypes(false, false, false);
