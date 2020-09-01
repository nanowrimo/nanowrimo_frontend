import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { isEmpty } from '@ember/utils';
//import fetch from 'fetch';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default BaseAuthenticator.extend({
  session: service(),
  serverSpoofEndpoint: `${ENV.APP.API_HOST}/users/`,
  tokenAttributeName: "auth_token",
  
  // For spoofing another user
  authenticate(user_id) {
    //alert('spoofing3');
    let { auth_token }  = this.get('session.data.authenticated');
    
    return new Promise((resolve, reject) => {
      return fetch(this.get('serverSpoofEndpoint')+user_id+'/spoof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
      })
      .then((response) => {
        return response.json()
        .then((json)=>{
          if (this._validate(json)) {
            resolve(json);
            location.reload();
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
