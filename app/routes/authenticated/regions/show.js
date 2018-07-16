import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').queryRecord('region', { slug: params.slug });
  }

  //setupController(controller, model) {
    //this._super(...arguments);
    //controller.set('userParam', model.get('slug'));
  //}
});
