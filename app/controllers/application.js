import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  show_navigation: Ember.computed('routeName', function() {
    let rn = this.get('routeName');
    return (rn!="sign-in" && rn!="sign-up");
  }),
  routeName: Ember.computed('currentPath', function() {
    return this.get('currentPath');
  }),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },    
  }
});
