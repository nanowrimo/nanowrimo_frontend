import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    this.transitionTo('authenticated.regions.show.admin.writing.show', '0');
  }
  
});
