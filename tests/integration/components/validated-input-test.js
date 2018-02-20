import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';

module('Integration | Component | validated-input', function(hooks) {
  setupRenderingTest(hooks);

  test('renders a label', async function(assert) {

    await render(hbs`{{validated-input label="Label" name="Name"}}`);

    assert.equal(find('label').getAttribute('for'), 'Name');
    assert.equal(find('label').textContent, 'Label');
  });
});
