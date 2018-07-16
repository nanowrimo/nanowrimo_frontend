import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').queryRecord('user', { name: params.slug, include: 'externalLinks,favoriteBooks,favoriteAuthors,projects' });
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('userParam', model.get('slug'));
  }
});
