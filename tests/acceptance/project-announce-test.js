import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
//import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | project announce', function(hooks) {
  setupApplicationTest(hooks);
  //setupMirage(hooks);

  let user;

  hooks.beforeEach(function(/*assert*/) {
    user = this.server.create('user');
    authenticateSession();
  });

  test('announce new Project button only appears for self User', async function(assert) {
    let otheruser = this.server.create('user');

    await visit(`/participants/${otheruser.name}/projects`);

    assert.dom('[data-test-new-project]').doesNotExist('no new Project button for other User');

    await visit(`/participants/${user.name}/projects`);

    assert.dom('[data-test-new-project]').exists('new Project button shown for self User');
  });

  test('announce a new Project', async function(assert) {
    await visit(`/participants/${user.name}/projects`);
    await click('[data-test-new-project]');

    assert.dom('[data-test-project-form]').exists('form is shown');

    let title = 'My New Project';
    await fillIn('[data-test-form-for--input=title]', title);
    await click('[data-test-project-submit]');

    assert.dom('[data-test-project-form]').exists('form is still shown (Step 2)');
/*
    await click('[data-test-project-submit]');

    assert.dom('[data-test-project-form]').exists('form is still shown (Step 3)');

    await fillIn('[data-test-form-for--input=wordCount]', '1234');
    await fillIn('[data-test-form-for--textarea=summary]', 'This is my summary.');
    await fillIn('[data-test-form-for--textarea=excerpt]', 'This is my excerpt.');
    await fillIn('[data-test-form-for--input=pinterestUrl]', 'https://pinterest.com/username');
    await fillIn('[data-test-form-for--input=playlistUrl]', 'https://spotify.com/username');
    await click('[data-test-project-submit]');

    assert.dom('[data-test-project-form]').doesNotExist('form is dismissed');
    assert.dom('[data-test-project-list]').includesText(title, 'new Project is shown in list');
    */
  });
});
