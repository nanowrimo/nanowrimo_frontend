import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ProjectValidations from 'nanowrimo/validations/project';

export default Controller.extend({
  router: service(),

  ProjectValidations,

  project: alias('model'),

  actions: {
    afterSubmit() {
      this.get('router').transitionTo('authenticated.projects');
    }
  }
});
