import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let group = this.modelFor('authenticated.regions.show');
    return this.get('store').query('group', { group_type: "event", filter: {group_id: group.id}});
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('group', this.modelFor('authenticated.regions.show'));
  },
});
