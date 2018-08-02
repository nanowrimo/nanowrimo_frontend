import { module } from 'qunit';
//import { module, test } from 'qunit';
//import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | sign in', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  /*test('Basic Authentication', async function(assert) {
    let user = this.server.create('user');

    await visit('/sign-in');

    await click('[data-test-sign-in-submit]');

    assert.equal(currentURL(), '/sign-in', 'does not submit blank form');

    await fillIn('input[data-test-form-for--input=email]', user.email);
    await fillIn('input[data-test-form-for--input=password]', 'password');
    await click('[data-test-sign-in-submit]');

    assert.equal(currentURL(), '/', 'redirected to dashboard');
  });*/
});
