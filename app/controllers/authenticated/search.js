import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
export default Controller.extend({
  currentUser: service(),
  router: service(),
  queryParams: ['input'],
  input: null,
  resultString: computed("model.data", function() {
    return JSON.stringify(this.model.data);
  }),
  
  actions: {
  }
});
