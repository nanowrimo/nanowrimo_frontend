import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  beforeModel(/* transition */) {
    this.transitionTo('/year-in-review/2020'); // Implicitly aborts the on-going transition.
  }
}