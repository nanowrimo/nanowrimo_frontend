import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import { isEmpty } from '@ember/utils';
import ENV from 'nanowrimo/config/environment';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: `${ENV.APP.API_HOST}/users/sign_in`,

  identificationAttributeName: 'login',
  identificationAttributeNameReturned: 'email',

  _validate(data) {
    const tokenAttributeName = this.get('tokenAttributeName');
    const identificationAttributeName = this.get('identificationAttributeNameReturned');
    const resourceName = this.get('resourceName');
    const _data = data[resourceName] ? data[resourceName] : data;

    return !isEmpty(_data[tokenAttributeName]) && !isEmpty(_data[identificationAttributeName]);
  }
});
