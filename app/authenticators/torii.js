import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';

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
          
          if (provider === 'custom-google') {
            let { user_id, access_token } = data;

            body = {
              method: 'google',
              user_id: user_id,
              token: access_token
            }

          } else if (provider === 'facebook-connect') {
            let { userId, accessToken } = data;

            body = {
              method: 'facebook',
              user_id: userId,
              token: accessToken
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
                resolve(response);
              } else {
                reject(response);
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
  }
});

