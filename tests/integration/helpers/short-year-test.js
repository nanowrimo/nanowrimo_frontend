import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | short-year', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a shortened year', async function(assert) {
    this.set('inputValue', '2018');

    await render(hbs`{{short-year inputValue}}`);

    assert.dom().hasText('18');
  });
});
