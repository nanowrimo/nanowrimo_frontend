import { module, test } from 'qunit';
import { visit, find, findAll } from '@ember/test-helpers';
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
      assert.equal(find(`[data-test-genre-item='${genre.id}']`).textContent, genre.name, 'shows each genre name');
    })
  });
});
