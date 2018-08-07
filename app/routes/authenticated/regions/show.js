import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').queryRecord('group', { slug: params.slug, include: 'groupExternalLinks' });
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('groupParam', model.get('slug'));
  }
  
});
