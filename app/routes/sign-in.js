import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'nanowrimo/mixins/unauthenticated-route';

export default Route.extend(UnauthenticatedRouteMixin, {
  setupController() {
    this.controllerFor('application').set('show-navigation', false);
  },
  
  model() {
    return this.store.createRecord('sign-in-attempt');
  }
});
