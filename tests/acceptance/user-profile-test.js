import { module, test } from 'qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | User profile', function(hooks) {
  setupApplicationTest(hooks);

  module('Unautheticated', function(/*hooks*/) {

    test('visiting User profile requires authentication', async function(assert) {
      await visit('/participants/username');

      assert.equal(currentURL(), '/sign-in', 'redirects to sign in');
    });
  });

  module('Authenticated', function(hooks) {
    setupMirage(hooks);

    let user;

    hooks.beforeEach(function(/*assert*/) {
      user = this.server.create('user', {
        createdAt: new Date(2018, 4, 8, 12)
      });
      authenticateSession();
    });

    test('User profile displays current User info', async function(assert) {
      await visit(`/participants/${user.name}`);

      assert.dom('img[data-test-user-avatar]').hasAttribute('src', user.avatar);
      assert.dom('img[data-test-user-avatar]').hasAttribute('alt', user.name);
      assert.dom('[data-test-user-name]').hasText(user.name);
      assert.dom('[data-test-user-location').hasText(user.location);
      assert.dom('[data-test-user-since').hasText(`Member since May 8, 2018`);
      //assert.dom('[data-test-user-bio]').hasText(user.bio);
    });

    test('User profile displays User links', async function(assert) {
      let links = this.server.createList('external-link', 3, { user });

      await visit(`/participants/${user.name}`);

      links.forEach(link => {
        assert.dom(`a[href='${link.url}']`).exists('external link is displayed');
      });
    });

    test('User profile displays User favorites', async function(assert) {
      let favoriteBooks = this.server.createList('favorite-book', 3, { user });
      let favoriteAuthors = this.server.createList('favorite-author', 3, { user });

      await visit(`/participants/${user.name}`);

      favoriteBooks.forEach(book => {
        assert.dom(`[data-test-favorite-book='${book.id}']`).hasText(book.title, 'book title is displayed');
      });
      favoriteAuthors.forEach(author => {
        assert.dom(`[data-test-favorite-author='${author.id}']`).hasText(author.name, 'author name is displayed');
      });
    });
  });
});
