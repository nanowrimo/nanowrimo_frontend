import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model(params) {
    return this.get('store').queryRecord('project', { slug: params.project_slug, include: 'genres,challenges'});
  },

  setupController(controller, model) { // eslint-disable-line no-unused-vars
    this._super(...arguments);
    controller.set('author', this.modelFor('authenticated.users.show') );
    controller.set('projectSlug', model.get('slug'));
  }
});
