const foo = require('./foo.js');
exports.testBar = function(value) {
  return foo.testFoo(value) + 1;
};
