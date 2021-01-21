import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model(params) {
    //return this.get('store').queryRecord('group', { slug: params.event_slug, include: 'location-groups,locations,group-users,users' });
    return this.get('store').queryRecord('group', { slug: params.event_slug, include: 'locationGroups,locations' });
  },
  setupController(controller, model) {
    this._super(controller, model);
    //controller.set('group', this.modelFor('authenticated.regions.show'));
  },
});
