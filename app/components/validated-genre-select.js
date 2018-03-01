import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';

export default Component.extend({
  store: service(),

  errors: null,
  hasAttemptedSubmit: false,
  name: 'genres',
  value: null,

  genres: computed(function() {
    return this.get('store').findAll('genre');
  }),

  unselectedGenres: computed('genres.[]', 'value.[]', function() {
    let value = this.get('value');
    return this.get('genres').reject((genre) => {
      return value.indexOf(genre) !== -1;
    });
  }),

  errorMessage: computed('errors.@each.validation', 'name', function() {
    let errors = this.get('errors');
    let name = this.get('name');
    let inputErrors = errors.findBy('key', name);
    return inputErrors ? inputErrors.validation[0] : null;
  }),

  selectClasses: computed('showErrorMessage', function() {
    let classes = ['form-control'];
    if (this.get('showErrorMessage')) {
      classes.push('is-invalid');
    }
    return classes.join(' ');
  }),

  showErrorMessage: computed('errorMessage', 'hasAttemptedSubmit', function() {
    return this.get('hasAttemptedSubmit') && isPresent(this.get('errorMessage'));
  }),

  init() {
    this._super(...arguments);
    if (this.get('value') === null) {
      this.set('value', []);
    }
  },

  actions: {
    createGenre(value) {
      let genre = this.get('genres').findBy('name', value);
      if (isNone(genre)) {
        genre = this.get('store').createRecord('genre', { name: value });
      }
      this.get('value').pushObject(genre);
    },

    showCreateWhen(value) {
      return isNone(this.get('genres').findBy('name', value));
    }
  }
});
