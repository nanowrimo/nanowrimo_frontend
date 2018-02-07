import GoogleOauth2BearerV2 from 'torii/providers/google-oauth2-bearer-v2';
import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';

export default GoogleOauth2BearerV2.extend({
  name: 'custom-google',

  // Modified from https://git.io/vAJ74
  open(options) {

    var name        = this.get('name'),
        url         = this.buildUrl(),
        redirectUri = this.get('redirectUri'),
        responseParams = this.get('responseParams'),
        tokenValidationUrl = this.get('tokenValidationUrl'),
        clientId = this.get('apiKey');

    return this.get('popup').open(url, responseParams, options).then(function(authData){
      var missingResponseParams = [];

      responseParams.forEach(function(param){
        if (authData[param] === undefined) {
          missingResponseParams.push(param);
        }
      });

      if (missingResponseParams.length){
        throw new Error("The response from the provider is missing " +
              "these required response params: " +
              missingResponseParams.join(', '));
      }

      /* at this point 'authData' should look like:
      {
        access_token: '<some long acces token string>',
        expires_in: '<time in s, was '3600' in jan 2017>',
        token_type: 'Bearer'
      }
      */

      // Token validation. For details, see
      // https://developers.google.com/identity/protocols/OAuth2UserAgent#validatetoken
      return new EmberPromise(function(resolve, reject) {
        // Token validation request
        let xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
          var jsonResponse = JSON.parse(xhr.responseText);
          /* the response is a JSON that looks like:
          {
            "audience":"8819981768.apps.googleusercontent.com",
            "user_id":"123456789",
            "scope":"profile email",
            "expires_in":436
          }
          */
          // the token is valid if the 'audience' is the same as the
          // 'client_id' (apiKey) provided to initiate authentication
          if (jsonResponse.audience === clientId) {
            // authentication succeeded. Add name and redirectUri to the
            // authentication data and resolve
            let { email, user_id } = jsonResponse;
            run(() => resolve(assign(authData, {
              provider: name, redirectUri: redirectUri,
              email: email, user_id: user_id
            })));
          } else if (jsonResponse.audience === undefined) {
            // authentication failed because the response from the server
            // is not as expected (no 'audience' field)
            run(() => reject(new Error("Unexpected response from token validation server. The 'audience' field may be missing.")));
          } else {
            // authentication failed because the token is invalid or has
            // been tempered with
            run(() => reject(new Error("Access token is invalid or has been tempered with. You may be subject to a 'confused deputy' attack.")));
          }
        };
        xhr.onerror = function() {
          // authentication failed because the validation request failed
          run(() => reject(new Error(`Token validation request failed with status '${xhr.statusText}' (server '${tokenValidationUrl}' '${xhr.responseText}').`)));
        };
        xhr.open('GET', `${tokenValidationUrl}?access_token=${encodeURIComponent(authData['access_token'])}`);
        xhr.send();
      });
    });
  }
});
