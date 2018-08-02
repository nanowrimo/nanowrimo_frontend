import Component from '@ember/component';
import { reads }  from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  session: service(),
  nanoMenuService: service(),
  media: service(),
  
  currentUserName: reads('currentUser.user.name'),
  
  footerSubmenus: reads('nanoMenuService.submenus'),
  currentYear: computed(function() {
    var dt = new Date();
    return (dt.getYear() + 1900);
  })
});