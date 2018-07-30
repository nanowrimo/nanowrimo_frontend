import { module, test } from 'qunit';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | User profile edit', function(hooks) {
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

    assert.dom('[data-test-user-profile-edit]').doesNotExist('can not edit other User');

    await visit(`/participants/${user.name}`);

    assert.dom('[data-test-user-profile-edit]').exists('can edit self User');
  });

  test('can edit basic User profile', async function(assert) {
    await visit(`/participants/${user.name}`);
    await click('[data-test-user-profile-edit]');

    assert.dom('[data-test-user-edit-profile-form]').exists('form is shown');

    let newUserName = 'newusername';
    await fillIn('[data-test-form-for--input=name]', newUserName);
    let newUserLocation = 'Hilliard, OH';
    await fillIn('[data-test-form-for--input=location]', newUserLocation);
    await click('[data-test-user-profile-submit]');

    assert.dom('[data-test-user-edit-profile-form]').doesNotExist('form is dismissed');
    assert.dom('[data-test-user-name]').hasText(newUserName, 'new User name is shown');
    assert.dom('[data-test-user-location]').hasText(newUserLocation, 'new User location is shown');
    //assert.equal(currentURL(), `/participants/${newUserName}`, 'updates route with new User name')
  });

  test('can add an ExternalLink', async function(assert) {
    await visit(`/participants/${user.name}`);
    await click('[data-test-user-profile-edit]');

    let newURL = 'https://my.domain.com';
    fillIn('[data-test-external-link-url]', newURL);
    await click('[data-test-user-profile-submit]');

    assert.dom(`a[href='${newURL}']`).exists('new ExternalLink URL is linked to');
  }),

  test('can edit an ExernalLink', async function(assert) {
    let url = 'https://my.domain.com';
    let externalLink = this.server.create('external-link', { user, url });

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-profile-edit]');

    let inputSelector = `[data-test-external-link-url='${externalLink.id}']`;
    assert.dom(inputSelector).exists('field for ExternalLink url is shown');

    let newURL = 'https://my.newdomain.com';
    await fillIn(inputSelector, newURL);
    await click('[data-test-user-profile-cancel]');

    assert.dom(`a[href='${newURL}']`).doesNotExist('on cancel, new ExternalLink URL is not linked to');
    assert.dom(`a[href='${url}']`).exists('on cancel, old ExternalLink URL is still linked to');

    await click('[data-test-user-profile-edit]');
    await fillIn(inputSelector, newURL);
    await click('[data-test-user-profile-submit]');

    assert.dom(`a[href='${newURL}']`).exists('on save, new ExternalLink URL is linked to');
    assert.dom(`a[href='${url}']`).doesNotExist('on save, old ExternalLink URL is not linked to');
  });

  test('can delete an ExernalLink', async function(assert) {
    let externalLink = this.server.create('external-link', { user });

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-profile-edit]');

    let deleteSelector = `[data-test-external-link-delete='${externalLink.id}']`;
    assert.dom(deleteSelector).exists('link for ExternalLink delete is shown');

    await click(deleteSelector);
    await click('[data-test-user-profile-cancel]');

    assert.dom(`a[href='${externalLink.url}']`).exists('on cancel, ExternalLink URL is still linked to');

    await click('[data-test-user-profile-edit]');
    await click(deleteSelector);
    await click('[data-test-user-profile-submit]');

    assert.dom(`a[href='${externalLink.url}']`).doesNotExist('on save, ExternalLink URL is not linked to');
  });
});
