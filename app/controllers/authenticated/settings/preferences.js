import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),

  user: computed('currentUser.user',function() {
    return this.get('currentUser.user');
  })
});
