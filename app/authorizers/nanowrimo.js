import BaseAuthorizer from 'ember-simple-auth/authorizers/base';
import { isEmpty } from '@ember/utils';

export default BaseAuthorizer.extend({
  tokenAttributeName: 'auth_token',

  authorize(data = {}, block = () => {}) {
    if (!isEmpty(data) && !isEmpty(data.auth_token)) {
      block('Authorization', `${data.auth_token}`);
    }
  }
});
