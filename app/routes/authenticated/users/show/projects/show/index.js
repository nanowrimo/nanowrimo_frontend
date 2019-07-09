import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    return this.modelFor('authenticated.users.show.projects.show');
  },
  setupController(controller, model) { // eslint-disable-line no-unused-vars
    this._super(...arguments);
    controller.set('author', this.modelFor('authenticated.users.show') );
  }
});
