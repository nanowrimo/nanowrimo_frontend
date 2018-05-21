import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | array-includes', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns true/false if array contains item', async function(assert) {
    this.set('inputArray', [ 1, 2, 3 ]);
    this.set('inputValue', 2);

    await render(hbs`{{array-includes inputArray inputValue}}`);

    assert.dom().hasText('true');

    this.set('inputValue', 4);

    assert.dom().hasText('false');
  });
});
