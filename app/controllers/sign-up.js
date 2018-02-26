import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import SignUpAttemptValidations from 'nanowrimo/validations/signupattempt';

export default Controller.extend({
  SignUpAttemptValidations,

  session: service(),

  signUpAttempt: alias('model'),

  actions: {
    afterSubmit() {
      let { email, password, username, timeZone } = this.get('signUpAttempt');
      return fetch(`${ENV.APP.API_HOST}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, time_zone: timeZone })
      })
      .then(() => {
        return this.get('session').authenticate('authenticator:nanowrimo', email, password);
      });
    }
  }
});
