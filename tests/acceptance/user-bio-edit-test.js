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

  /*test('can edit User bio', async function(assert) {
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
  });*/

  test('can add a FavoriteBook', async function(assert) {
    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);

    let newBook = 'My Favorite Book';
    await fillIn(`[data-test-favorite-book-input='']`, newBook);
    await click('[data-test-user-bio-submit]');

    assert.dom('[data-test-favorite-books]').hasTextContaining(newBook, 'new Book title is displayed');

    await visit(`/participants/${user.name}`);

    assert.dom('[data-test-favorite-books]').hasTextContaining(newBook, 'new Book title is still displayed after reload');
  });

  test('can edit a FavoriteBook', async function(assert) {
    let book = this.server.create('favorite-book', { user });

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);

    let oldTitle = book.title;
    let newTitle = 'New Favorite Book';
    await fillIn(`[data-test-favorite-book-input='${book.id}']`, newTitle);
    await click('[data-test-user-bio-cancel]');

    assert.dom(`[data-test-favorite-book='${book.id}']`).hasText(oldTitle, 'old Book title is still displayed on cancel');

    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);
    await fillIn(`[data-test-favorite-book-input='${book.id}']`, newTitle);
    await click('[data-test-user-bio-submit]');

    assert.dom(`[data-test-favorite-book='${book.id}']`).hasText(newTitle, 'new Book title is displayed on save');

    await visit(`/participants/${user.name}`);

    assert.dom(`[data-test-favorite-book='${book.id}']`).hasText(newTitle, 'new Book title is still displayed after reload');
  });

  test('can delete a FavoriteBook', async function(assert) {
    let book = this.server.create('favorite-book', { user });

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);

    await click(`[data-test-favorite-book-delete='${book.id}']`);
    await click('[data-test-user-bio-cancel]');

    assert.dom(`[data-test-favorite-book='${book.id}']`).exists('old Book is still displayed on cancel');

    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);
    await click(`[data-test-favorite-book-delete='${book.id}']`);
    await click('[data-test-user-bio-submit]');

    assert.dom(`[data-test-favorite-book='${book.id}']`).doesNotExist('Book is removed on save');

    await visit(`/participants/${user.name}`);

    assert.dom(`[data-test-favorite-book='${book.id}']`).doesNotExist('Book is still removed after reload');
  });

  test('can add a FavoriteAuthor', async function(assert) {
    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);

    let newAuthor = 'Favorite Author';
    await fillIn(`[data-test-favorite-author-input='']`, newAuthor);
    await click('[data-test-user-bio-submit]');

    assert.dom('[data-test-favorite-authors]').hasTextContaining(newAuthor, 'new Author name is displayed');

    await visit(`/participants/${user.name}`);

    assert.dom('[data-test-favorite-authors]').hasTextContaining(newAuthor, 'new Author name is still displayed after reload');
  });

  test('can edit a FavoriteAuthor', async function(assert) {
    let author = this.server.create('favorite-author', { user });

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);

    let oldName = author.name;
    let newName = 'New Favorite Author';
    await fillIn(`[data-test-favorite-author-input='${author.id}']`, newName);
    await click('[data-test-user-bio-cancel]');

    assert.dom(`[data-test-favorite-author='${author.id}']`).hasText(oldName, 'old Author name is still displayed on cancel');

    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);
    await fillIn(`[data-test-favorite-author-input='${author.id}']`, newName);
    await click('[data-test-user-bio-submit]');

    assert.dom(`[data-test-favorite-author='${author.id}']`).hasText(newName, 'new Author name is displayed on save');

    await visit(`/participants/${user.name}`);

    assert.dom(`[data-test-favorite-author='${author.id}']`).hasText(newName, 'new Author name is still displayed after reload');
  });

  test('can delete a FavoriteAuthor', async function(assert) {
    let author = this.server.create('favorite-author', { user });

    await visit(`/participants/${user.name}`);
    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);

    await click(`[data-test-favorite-author-delete='${author.id}']`);
    await click('[data-test-user-bio-cancel]');

    assert.dom(`[data-test-favorite-author='${author.id}']`).exists('old Author is still displayed on cancel');

    await click('[data-test-user-edit-bio]');
    await click(`[role=tab][href='#favorites']`);
    await click(`[data-test-favorite-author-delete='${author.id}']`);
    await click('[data-test-user-bio-submit]');

    assert.dom(`[data-test-favorite-author='${author.id}']`).doesNotExist('Author is removed on save');

    await visit(`/participants/${user.name}`);

    assert.dom(`[data-test-favorite-author='${author.id}']`).doesNotExist('Author is still removed after reload');
  });
});
