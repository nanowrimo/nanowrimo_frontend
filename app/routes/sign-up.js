import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'nanowrimo/mixins/unauthenticated-route';

export default Route.extend(UnauthenticatedRouteMixin, {
  model() {
    return this.store.createRecord('sign-up-attempt');
  },
  afterModel() {
    // Hide the navigation when on the sign-up page
    this.controllerFor('application').set('show_navigation', false);
  }
});
