import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
  router: service(),

  project: alias('model'),

  modelErrors: computed('project.genres.[]', function() {
    return isEmpty(this.get('project.genres')) ? { genres: 'Must select at least one genre' } : null;
  }),

  actions: {
    afterSubmit() {
      this.get('router').transitionTo('authenticated.projects');
    }
  }
});
