import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { blur, find, findAll, focus, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | validated-input', function(hooks) {
  setupRenderingTest(hooks);

  test('renders a label', async function(assert) {

    await render(hbs`{{validated-input label="Label" name="Name"}}`);

    assert.equal(find('label').getAttribute('for'), 'Name');
    assert.equal(find('label').textContent, 'Label');
  });

  test('renders error messages appropriately', async function(assert) {
    let key = 'keyvalue';
    let errorMessage = "Error message";
    this.set('hasAttemptedSubmit', false);
    this.set('name', key);
    this.set('errors', [
      {
        key,
        validation: [ errorMessage ]
      }
    ]);

    await render(hbs`{{validated-input hasAttemptedSubmit=hasAttemptedSubmit errors=errors name=name}}`);

    assert.equal(findAll('[data-test-error-message]').length, 0, 'does not show error initially');

    await this.set('hasAttemptedSubmit', true);

    assert.equal(findAll('[data-test-error-message]').length, 1, 'does show error after attempted form submission');
    assert.equal(find('[data-test-error-message]').textContent, errorMessage, 'shows error message after attempted form submission');

    await this.set('hasAttemptedSubmit', false);
    await focus(`input[name=${key}]`);
    await blur(`input[name=${key}]`);

    //assert.equal(findAll('[data-test-error-message]').length, 1, 'does show error after input blur');
    //assert.equal(find('[data-test-error-message]').textContent, errorMessage, 'shows error message after input blur');

    await this.set('errors', []);

    assert.equal(findAll('[data-test-error-message]').length, 0, 'does not show error when one is not passed in');
  });
});
