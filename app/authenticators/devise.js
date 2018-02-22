import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import ENV from 'nanowrimo/config/environment';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: `${ENV.APP.API_HOST}/auth/sign_in`,

  identificationAttributeName: 'email'
});
