const B = require('./b.js');
const A = require('./a.js');

console.log(new A().getB().getA());
console.log(new B().getA().getB());
