import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default Controller.extend({
  currentUser: service(),
  router: service(),
  queryParams: ['input'],
  input: null,
  actions: {
  }
});
