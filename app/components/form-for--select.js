import Component from '@ember/component';
import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  label: '',
  options: null,
  property: null,

  name: reads('property'),

  normalizedOptions: computed('options.[]', function() {
    return this.get('options').map(function(option) {
      return (typeof option === 'string') ? { name: option, value: option } : option;
    });
  }),

  init() {
    this._super(...arguments);
    assert('Must pass options array into {{form-for--select}}', isArray(this.get('options')));
  }
});
