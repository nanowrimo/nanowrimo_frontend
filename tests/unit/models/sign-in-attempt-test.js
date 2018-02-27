import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | sign in attempt', function(hooks) {
  setupTest(hooks);

  test('gets created with a client ID', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('sign-in-attempt', {}));
    assert.ok(model.get('id'), 'client ID has been set');
  });
});
