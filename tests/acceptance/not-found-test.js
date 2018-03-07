import { module, test } from 'qunit';
import { currentURL, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | route not found', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting an undefined route', async function(assert) {
    await visit('/random-undefined-route');

    assert.equal(currentURL(), '/random-undefined-route');
    assert.equal(find('[data-test-not-found-header]').textContent, '404 Not Found', 'should render 404 page');
  });
});
