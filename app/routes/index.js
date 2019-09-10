import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'nanowrimo/mixins/unauthenticated-route';

export default Route.extend(UnauthenticatedRouteMixin, {
  model() {
  }
  
});
