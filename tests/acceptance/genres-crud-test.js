import { module, test } from 'qunit';
import { click, currentURL, fillIn, find, findAll, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirageTest from 'nanowrimo/tests/helpers/ember-cli-mirage';

module('Acceptance | genres CRUD', function(hooks) {
  setupApplicationTest(hooks);
  setupMirageTest(hooks);

  test('list genres', async function(assert) {
    let genreCount = 3;
    let genres = this.server.createList('genre', genreCount);

    await authenticateSession();
    await visit('/genres');

    assert.equal(findAll('[data-test-genre-item]').length, genreCount, 'shows the correct number of items');
    genres.forEach(function(genre) {
      assert.equal(find(`[data-test-genre-item='${genre.id}']`).textContent.trim(), genre.name, 'shows each genre name');
    })
  });

  test('create new genre', async function(assert) {
    await authenticateSession();
    await visit('/genres');
    await click('[data-test-new-genre]');

    assert.equal(currentURL(), '/genres/new', 'links to new genre form');

    let newName = 'NewGenre';
    await fillIn('input[data-test-validated-input=name]', newName);
    await click('[data-test-genre-submit]');

    assert.equal(currentURL(), '/genres', 'redirects to genres index');
    assert.equal(find(`[data-test-genre-item]`).textContent.trim(), newName, 'index shows new genre');
  });

  test('show genre details', async function(assert) {
    let genre = this.server.create('genre');

    await authenticateSession();
    await visit('/genres');
    await click(`[data-test-show-genre='${genre.id}']`);

    assert.equal(currentURL(), `/genres/${genre.id}`, 'links to genre show');
    assert.equal(find('[data-test-genre-name]').textContent, genre.name, 'show displays genre name');
  });

  test('show genre details', async function(assert) {
    let genre = this.server.create('genre');

    await authenticateSession();
    await visit('/genres');
    await click(`[data-test-show-genre='${genre.id}']`);

    assert.equal(currentURL(), `/genres/${genre.id}`, 'links to genre show');
    assert.equal(find('[data-test-genre-name]').textContent, genre.name, 'show displays genre name');
  });

  test('edit genre details', async function(assert) {
    let genre = this.server.create('genre');

    await authenticateSession();
    await visit(`/genres/${genre.id}`);
    await click('[data-test-edit-genre]');

    assert.equal(currentURL(), `/genres/${genre.id}/edit`, 'links to genre edit form');

    let newName = 'NewGenreName';
    await fillIn('input[data-test-validated-input=name]', newName);
    await click('[data-test-genre-submit]');

    assert.equal(currentURL(), `/genres/${genre.id}`, 'redirects to genre details');
    assert.equal(find('[data-test-genre-name]').textContent, newName, 'displays new genre name');
  });
});
