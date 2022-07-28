import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let user = this.modelFor('authenticated.users.show');
    if (!user.regionsLoaded) {
      user.loadRegions();
    }
    if (!user.writingGroupsLoaded) {
      user.loadWritingGroups();
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('user', this.modelFor('authenticated.users.show'));
  },
});
