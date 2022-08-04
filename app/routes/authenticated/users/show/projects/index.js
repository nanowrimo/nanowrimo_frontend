import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let user = this.modelFor('authenticated.users.show');
    return this.get('store').query('project', {
      filter: { user_id: user.id },
      include: 'genres,project-challenges,user'
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('user', this.modelFor('authenticated.users.show'));
  },

  refreshModel() {
    this.refresh();
  }
});
