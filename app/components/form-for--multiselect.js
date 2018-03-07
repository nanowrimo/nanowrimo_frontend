import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';

export default Component.extend({
  store: service(),

  createOptionModel: null,
  hasAttemptedSubmit: false,
  label: '',
  model: null,
  options: null,
  property: '',
  searchField: '',

  _selectedOptions: computed('model', 'property', function() {
    return this.get(`model.${this.get('property')}`);
  }),

  unselectedOptions: computed('options.[]', '_selectedOptions.[]', function() {
    let selectedOptions = this.get('_selectedOptions');
    return this.get('options').reject((option) => {
      return selectedOptions.indexOf(option) !== -1;
    });
  }),

  actions: {
    createOption(value) {
      let createOptionModel = this.get('createOptionModel');
      if (isPresent(createOptionModel)) {
        let searchField = this.get('searchField');
        let option = this.get('options').findBy(searchField, value);
        if (isNone(option)) {
          let props = {};
          props[searchField] = value;
          option = this.get('store').createRecord(createOptionModel, props);
        }
        this.get(`model.${this.get('property')}`).pushObject(option);
      }
    },

    showCreateWhen(value) {
      return isNone(this.get('options').findBy(this.get('searchField'), value));
    }
  }
});
