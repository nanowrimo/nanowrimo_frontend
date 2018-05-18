import Component from '@ember/component';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  session: service(),
  nanoMenuService: service(),

  currentUserName: reads('currentUser.user.name'),
  submenus: reads('nanoMenuService.submenus'),
  
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});