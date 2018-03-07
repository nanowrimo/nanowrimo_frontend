import { module, test } from 'qunit';
import { currentURL, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | route not found', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting an undefined route', async function(assert) {
    await visit('/random-undefined-route');

    assert.equal(currentURL(), '/random-undefined-route');
    assert.equal(find('[data-test-not-found-header]').textContent, '404 Not Found', 'should render 404 page');
  });

  test('visiting an undefined model', async function(assert) {
    await authenticateSession();
    await visit('/genres/random-id');

    assert.equal(currentURL(), '/genres/random-id');
    assert.equal(find('[data-test-not-found-header]').textContent, '404 Not Found', 'should render 404 page');
  });
});
