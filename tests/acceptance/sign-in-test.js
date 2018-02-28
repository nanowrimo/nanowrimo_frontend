import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirageTest from 'nanowrimo/tests/helpers/ember-cli-mirage';

module('Acceptance | sign in', function(hooks) {
  setupApplicationTest(hooks);
  setupMirageTest(hooks);

  test('Basic Authentication', async function(assert) {
    await visit('/sign-in');

    await click('[data-test-sign-in-submit]');

    assert.equal(currentURL(), '/sign-in', 'does not submit blank form');

    await fillIn('input[data-test-validated-input=email]', 'user@example.com');
    await fillIn('input[data-test-validated-input=password]', 'password');
    await click('[data-test-sign-in-submit]');

    assert.equal(currentURL(), '/', 'redirected to dashboard');
  });
});
