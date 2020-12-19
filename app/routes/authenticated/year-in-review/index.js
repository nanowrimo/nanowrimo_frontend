import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    this.transitionTo('/year-in-review/2020');
  }
});