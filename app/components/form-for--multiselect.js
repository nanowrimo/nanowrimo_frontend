import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';

export default Component.extend({
  store: service(),

  errorMessage: '',
  hasAttemptedSubmit: false,
  model: null,
  property: '',

  genres: computed(function() {
    return this.get('store').findAll('genre');
  }),

  selectedGenres: computed('model', 'property', function() {
    return this.get(`model.${this.get('property')}`);
  }),

  unselectedGenres: computed('genres.[]', 'selectedGenres.[]', function() {
    let selectedGenres = this.get('selectedGenres');
    return this.get('genres').reject((genre) => {
      return selectedGenres.indexOf(genre) !== -1;
    });
  }),

  actions: {
    createGenre(value) {
      let genre = this.get('genres').findBy('name', value);
      if (isNone(genre)) {
        genre = this.get('store').createRecord('genre', { name: value });
      }
      this.get(`model.${this.get('property')}`).pushObject(genre);
    },

    showCreateWhen(value) {
      return isNone(this.get('genres').findBy('name', value));
    }
  }
});
