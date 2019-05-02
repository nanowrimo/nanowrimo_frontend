import Controller from '@ember/controller';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
  currentUser: service(),
  router: service(),
  queryParams: ['input'],
  input: null,
  actions: {
  }
});
