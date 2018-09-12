import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let user = this.modelFor('authenticated.users.show');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('user', this.modelFor('authenticated.users.show'));
  },

  actions: {
    refreshModel() {
      this.refresh();
    }
  }
  
});
