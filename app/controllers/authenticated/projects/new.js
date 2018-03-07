import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  project: alias('model'),

  actions: {
    afterSubmit() {
      this.get('router').transitionTo('authenticated.projects');
    }
  }
});
