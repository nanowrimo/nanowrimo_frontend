import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let group = this.modelFor('authenticated.regions.show');
    return this.get('store').query('group', { filter: {group_id: group.id, group_type: "event"}});
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('group', this.modelFor('authenticated.regions.show'));
  },
});
