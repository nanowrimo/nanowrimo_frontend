import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let project = this.modelFor('authenticated.users.show.projects.show');
    return this.get('store').query('projectChallenge', { filter: {project_id: project.id}, include: 'challenge,project-sessions'});
  },
  
  setupController(controller, model) { // eslint-disable-line no-unused-vars
    this._super(...arguments);
    controller.set('author', this.modelFor('authenticated.users.show') );
    controller.set('project', this.modelFor('authenticated.users.show.projects.show') );
  }

});
