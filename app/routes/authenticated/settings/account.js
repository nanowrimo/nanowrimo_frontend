import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    willTransition: function(transition) {
      this.controller.set('_formResponseMessage',null);
      this.controller.set('newEmail',null);
    }
  }
});
