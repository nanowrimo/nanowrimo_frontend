import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | sign in', function(hooks) {
  setupApplicationTest(hooks);

  test('Basic Authentication', async function(assert) {
    await visit('/sign-in');

    await fillIn('input[name=email]', 'user@example.com');
    await fillIn('input[name=password]', 'password');
    await click('input[type=submit]');

    assert.equal(currentURL(), '/dashboard', 'redirected');
  });
});
