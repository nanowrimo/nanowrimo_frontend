import { module, test } from 'qunit';
import validateUniqueUsername from 'nanowrimo/validators/unique-username';

module('Unit | Validator | unique-username');

test('it exists', function(assert) {
  assert.ok(validateUniqueUsername());
});
