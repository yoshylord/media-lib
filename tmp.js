var Proc = require("./proc.js");

console.log('STARTING');
var proc01 = new Proc();
var proc02 = new Proc();

console.log('proc01:');
console.log(proc01.toString());

console.log('proc02:');
console.log(proc02.toString());

console.log('CHANGING');
proc01.transform(1);
proc02.transform(2);

console.log('proc01:');
console.log(proc01.toString());

console.log('proc02:');
console.log(proc02.toString());

module.exports = Proc;
