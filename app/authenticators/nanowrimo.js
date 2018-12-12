import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { isEmpty } from '@ember/utils';
import fetch from 'fetch';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';

export default BaseAuthenticator.extend({
  serverTokenEndpoint: `${ENV.APP.API_HOST}/users/sign_in`,
  tokenAttributeName: "auth_token",
  
  authenticate(identifier, password) {
    return new Promise((resolve, reject) => {
      return fetch(this.get('serverTokenEndpoint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      })
      .then((response) => {
        return response.json()
        .then((json)=>{
          if (this._validate(json)) {
            resolve(json);
          } else {
            reject(json);
          }
        })
      })
      .catch((error) => {
        reject(error);
      });
    });
  },

  restore(data){
    return new Promise((resolve, reject) => {
      if (!isEmpty(data.auth_token) ) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  invalidate() {
    return Promise.resolve();
  },

  _validate(data) {
    return !isEmpty(data[this.get('tokenAttributeName')]);
  }
});
