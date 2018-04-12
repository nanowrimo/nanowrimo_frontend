import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  session: service(),
  show_navigation: computed('routeName', function() {
    let no_nav_routes = ["sign-in","sign-up"];
    let rn = this.get('routeName');
    return !no_nav_routes.includes(rn);
  }),
  routeName: computed('currentPath', function() {
    return this.get('currentPath');
  }),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },    
  }
});
