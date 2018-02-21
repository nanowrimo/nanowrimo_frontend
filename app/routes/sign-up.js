import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'nanowrimo/mixins/unauthenticated-route';
import moment from 'moment';

export default Route.extend(UnauthenticatedRouteMixin, {
  model() {
    return {
      email: '',
      password: '',
      username: '',
      timeZone: moment.tz.guess()
    };
  },

  resetController(controller, isExiting, transition) { // eslint-disable-line no-unused-vars
    if (isExiting) {
      controller.set('isStepOne', true);
    }
  }
});
