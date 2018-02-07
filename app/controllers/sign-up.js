import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  isStepOne: true,

  user: alias('model'),

  buttonLabel: computed('isStepOne', function() {
    let isStepOne = this.get('isStepOne');
    return isStepOne ? "Continue" : "Sign Up";
  }),

  actions: {
    createUser() {
      let isStepOne = this.get('isStepOne');

      if (isStepOne) {
        this.set('isStepOne', false);
      } else {
        let user = this.get('user');
        user.save()
          .then(() => {
            this.get('router').transitionTo('index');
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
  }
});
