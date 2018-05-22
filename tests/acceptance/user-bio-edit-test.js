import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | User bio edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let user;

  hooks.beforeEach(function(/*assert*/) {
    user = this.server.create('user');
    authenticateSession();
  });

  test('edit link only appears for current User', async function(assert) {
    this.server.create('user', { name: 'otheruser' });
    await visit('/participants/otheruser');

    assert.dom('[data-test-user-edit-bio]').doesNotExist('can not edit other User');

    await visit(`/participants/${user.name}`);

    assert.dom('[data-test-user-edit-bio]').exists('can edit self User');
  });

  test('can edit User bio', async function(assert) {
    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');

    assert.dom('[data-test-user-edit-bio-form]').exists('form is shown');
    let oldBio = user.bio;
    assert.dom('[data-test-form-for--textarea=bio]').hasValue(oldBio, 'old User bio is shown in edit modal');

    let newBio = 'This is my new bio.';
    await fillIn('[data-test-form-for--textarea=bio]', newBio);
    await click('[data-test-user-bio-cancel]');

    assert.dom('[data-test-user-edit-bio-form]').doesNotExist('form is dismissed');
    assert.dom('[data-test-user-bio]').hasText(oldBio, 'old User bio is still shown after cancel');

    await click('[data-test-user-edit-bio]');

    assert.dom('[data-test-form-for--textarea=bio]').hasValue(oldBio, 'old User bio is shown in edit modal');

    await fillIn('[data-test-form-for--textarea=bio]', newBio);
    await click('[data-test-user-bio-submit]');

    assert.dom('[data-test-user-edit-bio-form]').doesNotExist('form is dismissed');
    assert.dom('[data-test-user-bio]').hasText(newBio, 'new User bio is shown');
  });
});
