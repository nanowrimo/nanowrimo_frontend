import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model(params) {
    return this.get('store').queryRecord('group', { slug: params.slug });
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('groupParam', model.get('slug'));
  }
});

//import Route from '@ember/routing/route';

//export default Route.extend({
  //model(params) {
    //return this.get('store').queryRecord('group', { slug: params.slug });
    //return this.get('store').queryRecord('group', { slug: params.slug, include: 'groups' }).then(()=>{ this.set('dataLoaded', true) });
  //},
  //setupController(controller, model) {
    //this._super(...arguments);
    //controller.set('groupParam', model.get('slug'));
  //}
//});
