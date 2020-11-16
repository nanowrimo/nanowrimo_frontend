import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  group: alias('model'),
  currentUser: service(),
  
  canAddEvent: computed('currentUser.user.name', function() {
    return true;//((this.get('currentUser.user.name')=="Dave Beck")||(this.get('currentUser.user.name')=="Jezra"));
  }),
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.isLoaded',function() {
    if (this.get('currentUser.isLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        let found = false;
        gus.forEach((gu)=>{
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
            found = true;
          }
        });
        return found;
      }
    } else {
      return false;
    }
  }),
  
  
});
