import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let project = this.modelFor('authenticated.users.show.projects.show');
    return this.get('store').query('projectChallenge', { filter: {project_id: project.id}, include: 'challenge,project-sessions'});
  }

});
