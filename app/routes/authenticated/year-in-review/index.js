import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
		// what is the current year?
		var date = new Date();
		var year = date.getFullYear();
    this.transitionTo(`/year-in-review/${year}`);
  }
});
