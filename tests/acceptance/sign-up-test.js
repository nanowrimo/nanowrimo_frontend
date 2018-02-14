import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | sign up', function(hooks) {
  setupApplicationTest(hooks);

  test('Basic Registration', async function(assert) {
    await visit('/sign-up');

    await fillIn('input[data-test-sign-up-email]', 'user@example.com');
    await fillIn('input[data-test-sign-up-password]', 'password');
    await click('input[data-test-sign-up-submit]');

    await fillIn('input[data-test-sign-up-username]', 'username');
    await click('input[data-test-sign-up-submit]');

    assert.equal(currentURL(), '/', 'redirects after sign up');
  });
});
