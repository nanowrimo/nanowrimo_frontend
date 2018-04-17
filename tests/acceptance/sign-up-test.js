import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | sign up', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Basic Registration', async function(assert) {
    await visit('/sign-up');

    await fillIn('input[data-test-form-for--input=email]', 'user@example.com');
    await fillIn('input[data-test-form-for--input=password]', 'password');
    await click('input[data-test-sign-up-submit]');

    await fillIn('input[data-test-form-for--input=username]', 'username');
    await click('input[data-test-sign-up-submit]');

    assert.equal(currentURL(), '/sign-up', 'redirects after sign up');
  });
});
