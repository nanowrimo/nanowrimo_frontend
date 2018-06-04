import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let user = this.modelFor('authenticated.users.show');
    return this.get('store').query('project', {
      filter: { user_id: user.id},
      include: 'genres,challenges'
    }).then(function(projects){
      return projects;
    });
  }
});
