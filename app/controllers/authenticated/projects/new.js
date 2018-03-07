import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  store: service(),

  project: alias('model'),

  genreOptions: computed(function() {
    return this.get('store').findAll('genre');
  }),

  actions: {
    afterSubmit() {
      this.get('router').transitionTo('authenticated.projects');
    }
  }
});
