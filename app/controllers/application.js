import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  showNavigation: true,
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
  }
});
