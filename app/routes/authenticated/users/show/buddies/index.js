import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let user = this.modelFor('authenticated.users.show');
    return user.loadGroupUsers('buddies');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('user', this.modelFor('authenticated.users.show'));
  },
});
