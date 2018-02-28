import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import GenreValidations from 'nanowrimo/validations/genre';

export default Controller.extend({
  router: service(),

  GenreValidations,

  genre: alias('model'),

  actions: {
    afterSubmit() {
      this.get('router').transitionTo('authenticated.genres');
    }
  }
});
