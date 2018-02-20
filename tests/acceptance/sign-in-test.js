import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | sign in', function(hooks) {
  setupApplicationTest(hooks);

  test('Basic Authentication', async function(assert) {
    await visit('/sign-in');

    await fillIn('input[data-test-validated-input=email]', 'user@example.com');
    await fillIn('input[data-test-validated-input=password]', 'password');
    await click('[data-test-sign-in-submit]');

    assert.equal(currentURL(), '/', 'redirected to dashboard');
  });
});
