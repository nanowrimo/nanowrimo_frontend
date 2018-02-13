import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({
  model() {
    return {
      timeZone: moment.tz.guess()
    };
  },

  resetController(controller, isExiting, transition) { // eslint-disable-line no-unused-vars
    if (isExiting) {
      controller.set('isStepOne', true);
    }
  }
});
