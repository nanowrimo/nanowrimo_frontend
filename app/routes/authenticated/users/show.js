import ScrollRoute from 'nanowrimo/routes/scroll-route'


export default ScrollRoute.extend({
  model(params) {
    return this.get('store').queryRecord('user', { name: params.slug, include: 'externalLinks,favoriteBooks,favoriteAuthors,projects,projectChallenges,projectSessions,user-badges' });
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('userParam', model.get('slug'));
  }
});
