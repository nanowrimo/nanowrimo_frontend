import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-number', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders comma-separated numbers', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{format-number inputValue}}`);

    assert.dom().hasText('1,234');

    this.set('inputValue', '12345678');

    assert.dom().hasText('12,345,678');
  });
});
