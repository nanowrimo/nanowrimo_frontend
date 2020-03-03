import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  model() {
    let userSlug = this.get('currentUser.user.slug');
    return userSlug;
  },
  afterModel(model) {
    let us = model;
    this.transitionTo('authenticated.users.show.groups', us);
  }
});
