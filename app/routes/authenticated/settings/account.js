import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    willTransition: function() {
      this.controller.set('_formResponseMessage',null);
      this.controller.set('newEmail',null);
    }
  }
});
