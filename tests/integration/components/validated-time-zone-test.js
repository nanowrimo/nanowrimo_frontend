import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | validated-time-zone', function(hooks) {
  setupRenderingTest(hooks);

  test('renders error messages appropriately', async function(assert) {
    let key = 'timeZone';
    let errorMessage = 'Error message';
    this.set('hasAttemptedSubmit', false);
    this.set('name', key);
    this.set('errors', [
      {
        key,
        validation: [ errorMessage ]
      }
    ]);

    await render(hbs`{{validated-time-zone hasAttemptedSubmit=hasAttemptedSubmit errors=errors name=name}}`);

    assert.equal(findAll('[data-test-error-message]').length, 0, 'does not show error initially');

    await this.set('hasAttemptedSubmit', true);

    assert.equal(findAll('[data-test-error-message]').length, 1, 'does show error after attempted form submission');
    assert.equal(find('[data-test-error-message]').textContent, errorMessage, 'shows error message after attempted form submission');

    await this.set('errors', []);

    assert.equal(findAll('[data-test-error-message]').length, 0, 'does not show error when one is not passed in');
  });
});
