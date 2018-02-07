import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('user');
  },

  // eslint-disable-next-line no-unused-vars
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('isStepOne', true);
    }
  }
});
