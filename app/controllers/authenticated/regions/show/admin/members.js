import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  activeTab: 'members',
  reorder: false,
  resize: true,
  columns: [
      {
        name: `User`,
        valuePath: `name`
      },
      {
        name: `Signed up`,
        valuePath: `joined_site`
      },
      {
        name: `Joined region`,
        valuePath: `joined_region`
      },
      {
        name: `Last login`,
        valuePath: `sign_in`
      },
      {
        name: `Homed?`,
        valuePath: `homed`
      },
      {
        name: `Last update`,
        valuePath: `last_update`
      },
    ],
  sorts: [
      {
        valuePath: 'name',
        isAscending: false,
      },
      {
        valuePath: 'joined_site',
        isAscending: false,
      },
      {
        valuePath: 'joined_region',
        isAscending: false,
      },
      {
        valuePath: 'sign_in',
        isAscending: false,
      },
      {
        valuePath: 'homed',
        isAscending: false,
      },
      {
        valuePath: 'last_update',
        isAscending: false,
      },
    ],
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.user.groupUsersLoaded',function() {
    if (this.get('currentUser.user.groupUsersLoaded')) {
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
    
  groupMembers: computed('model.listResults',function() {
    const lr = this.get('model.listResults');
    let a = [];
    let b = [];
    for (const [key, value] of Object.entries(lr)) {
      a.push(value[0]);
      b.push(key);
    }
    return a;
  }),
  
});
