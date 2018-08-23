import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import fetch from 'fetch';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';
import moment from 'moment';

export default ToriiAuthenticator.extend({
  torii: service(),
  tokenVerifyEndpoint: `${ENV.APP.API_HOST}/verify_sso_token`,
  
  authenticate(provider, options) {
    return new Promise((resolve, reject) => {
      return this._super(provider, options)
        .then((data) => {
          // pull data from the response
          let { provider } = data;
          let body = {};
          let time_zone = moment.tz.guess();
          if (!time_zone) {
            time_zone = "America/Los_Angeles2";
          }
          if (provider === 'custom-google') {
            let { user_id, access_token } = data;

            body = {
              method: 'google',
              user_id: user_id,
              token: access_token,
              time_zone: time_zone
            }

          } else if (provider === 'facebook-connect') {
            let { userId, accessToken } = data;

            body = {
              method: 'facebook',
              user_id: userId,
              token: accessToken,
              time_zone: time_zone
            }

          }
          
          // attempt to verify this data with the API server
          
          return fetch(this.get('tokenVerifyEndpoint'), { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
            }) 
            .then((response) => {
              if (response.ok) {
                return response.json()
                .then((json)=>{
                  resolve(json)
                })
              } else {
                return response.json()
                .then((json)=>{
                  reject(json)
                })
              }
            })
            .catch((error) => {
              reject(error);
            });
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
    return !isEmpty(data['auth_token']);
  }
  
  
});

