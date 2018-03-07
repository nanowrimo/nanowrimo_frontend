import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  routeAfterAuthentication: 'authenticated',

  actions: {
    error(error, transition) { // eslint-disable-line no-unused-vars
      let firstError = error.errors[0];
      if (firstError.status == 404) {
        this.intermediateTransitionTo('404');
      } else {
        this.intermediateTransitionTo('error');
      }
    }
  }
});
