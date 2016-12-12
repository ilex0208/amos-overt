let isArray = require('./../lib/core/isArray');
let test = require('tape');

test('is array', function(t){
  t.ok(isArray([]));
  t.notOk(isArray({}));
  t.notOk(isArray(null));
  t.notOk(isArray(false));
  t.notOk(isArray(''));

  let obj = {};
  obj[0] = true;
  t.notOk(isArray(obj));

  let arr = [];
  arr.foo = 'bar';
  t.ok(isArray(arr));

  t.end();
});