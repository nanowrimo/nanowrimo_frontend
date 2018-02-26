import BaseAuthorizer from 'ember-simple-auth/authorizers/base';
import { isEmpty } from '@ember/utils';

export default BaseAuthorizer.extend({
  tokenAttributeName: 'access_token',

  authorize(data = {}, block = () => {}) {
    if (!isEmpty(data) && !isEmpty(data.token)) {
      block('Authorization', `Bearer ${data.token}`);
    }
  }
});
