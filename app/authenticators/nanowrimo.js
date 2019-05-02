import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { isEmpty } from '@ember/utils';
import fetch from 'fetch';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default BaseAuthenticator.extend({
  session: service(),
  serverTokenEndpoint: `${ENV.APP.API_HOST}/users/sign_in`,
  serverLogoutEndpoint: `${ENV.APP.API_HOST}/users/logout`,
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
    // get the auth_token from the session data
    let { auth_token }  = this.get('session.data.authenticated');
    // make a POST request to the API's logout endpoint 
    fetch(this.get('serverLogoutEndpoint'), { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then(()=>{
      //we do nothing
    });
    
    //return a resolved promise to unauthenticate 
    return Promise.resolve();
  },

  _validate(data) {
    return !isEmpty(data[this.get('tokenAttributeName')]);
  }
});
