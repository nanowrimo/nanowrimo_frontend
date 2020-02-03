import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  group: null,
  
  init() {
    this._super(...arguments);
  },
  
});
