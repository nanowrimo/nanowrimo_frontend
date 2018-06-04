import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | User images edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let user;

  hooks.beforeEach(function(/*assert*/) {
    user = this.server.create('user');
    authenticateSession();
  });

  test('edit images form only appears for current User', async function(assert) {
    this.server.create('user', { name: 'otheruser' });

    await visit('/participants/otheruser');
    await click('[data-test-user-edit-avatar]');

    assert.dom('[data-test-user-images-form]').doesNotExist('can not edit other User avatar');

    await visit('/participants/otheruser');
    await click('[data-test-user-edit-plate]');

    assert.dom('[data-test-user-images-form]').doesNotExist('can not edit other User plate');

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-avatar]');

    assert.dom('[data-test-user-images-form]').exists('can edit self User avatar');

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-plate]');

    assert.dom('[data-test-user-images-form]').exists('can edit self User plate');
  });
});
