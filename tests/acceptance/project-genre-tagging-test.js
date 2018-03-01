import { module, test } from 'qunit';
import { click, currentURL, fillIn, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirageTest from 'nanowrimo/tests/helpers/ember-cli-mirage';

module('Acceptance | project genre tagging', function(hooks) {
  setupApplicationTest(hooks);
  setupMirageTest(hooks);

  test('creating a new project with genre tags', async function(assert) {
    await authenticateSession();
    await visit('/projects');
    await click('[data-test-new-project]');

    assert.equal(currentURL(), '/projects/new', 'linked to new project form');

    let projectName = 'Project Name';
    await fillIn('input[data-test-validated-input=name]', projectName);
    // Select tags
    await click('[data-test-project-submit]');

    assert.equal(currentURL(), '/projects', 'redirected to projects list');
    assert.equal(find('[data-test-project-name]').textContent.trim(), projectName, 'project list includes new project');
  });
});
