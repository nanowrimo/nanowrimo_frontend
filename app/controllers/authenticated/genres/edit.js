import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  genre: alias('model'),

  actions: {
    afterSubmit(modelWasNew) {
      if (modelWasNew) {
        this.get('router').transitionTo('authenticated.genres');
      } else {
        this.get('router').transitionTo('authenticated.genres.show', this.get('genre.id'));
      }
    }
  }
});
