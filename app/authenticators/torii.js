import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default ToriiAuthenticator.extend({
  torii: service(),

  authenticate(provider, options) {
    return this._super(provider, options)
      .then((data) => {
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

        return fetch('http://api.nanowrimo.org/users/sign_in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).then((response) => {
          return response.json().then((json) => {
            return json['user'] ? json['user'] : json;
          });
        });
      });
  }
});
