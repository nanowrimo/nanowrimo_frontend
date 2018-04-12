import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  show_navigation: true,
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },    
  }
});
