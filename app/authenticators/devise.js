import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import { isEmpty } from '@ember/utils';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: 'https://api.nanowrimo.org/users/sign_in',

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
