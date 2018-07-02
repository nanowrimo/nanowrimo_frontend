import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'nanowrimo/mixins/unauthenticated-route';

export default Route.extend(UnauthenticatedRouteMixin, {
  model() {
    return this.get('store').createRecord('fundometer', { id: 123, goalNumber: 1400000, raisedNumber: 139879, donorNumber: 1456 });
  }
  
});
