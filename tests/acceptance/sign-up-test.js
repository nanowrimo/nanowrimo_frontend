import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | sign up', function(hooks) {
  setupApplicationTest(hooks);

  test('Basic Registration', async function(assert) {
    await visit('/sign-up');

    await fillIn('input[name=username]', 'username');
    await click('input[type=submit]');

    assert.equal(currentURL(), '/', 'redirects after sign up');
  });
});
