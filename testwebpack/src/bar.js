const foo = require('./foo');
exports.testBar = function(value) {
  return foo.testFoo(value) + 1;
}
