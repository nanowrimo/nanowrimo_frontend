import Mixin from '@ember/object/mixin';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Mixin.create(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'authenticated.dashboard'
});
