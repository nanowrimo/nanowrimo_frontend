import { module, test } from 'qunit';
import { click, currentURL, fillIn, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { selectChoose } from 'ember-power-select/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | project genre tagging', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('list projects with genre tags', async function(assert) {
    let project = this.server.create('project');
    let genres = this.server.createList('genre', 2);
    genres.forEach((genre) => {
      this.server.create('project-genre', { project, genre });
    });

    await authenticateSession();
    await visit('/projects');

    assert.equal(find(`[data-test-project-name='${project.id}']`).textContent.trim(), project.name, 'list includes project name');
    genres.forEach(function(genre) {
      assert.equal(find(`[data-test-project-genres='${project.id}'] [data-test-genre-name='${genre.id}']`).textContent.trim(), genre.name, 'list includes associated genres');
    })
  });

  test('creating a new project with genre tags', async function(assert) {
    let genre = this.server.create('genre');

    await authenticateSession();
    await visit('/projects');
    await click('[data-test-new-project]');

    assert.equal(currentURL(), '/projects/new', 'linked to new project form');

    let projectName = 'Project Name';
    await fillIn('input[data-test-validated-input=name]', projectName);
    await selectChoose('[data-test-select-genre]', genre.name);
    await click('[data-test-project-submit]');

    assert.equal(currentURL(), '/projects', 'redirected to projects list');
    assert.equal(find('[data-test-project-name]').textContent.trim(), projectName, 'project list includes new project');
    assert.equal(find(`[data-test-genre-name='${genre.id}']`).textContent.trim(), genre.name, 'list includes associated genre');
  });
});
