import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';
import { later } from '@ember/runloop';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,
  isLoaded: false,
  groupUsersLoaded: false,
  load() {
    let t = this;
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user',
      { current: true, include: 'projects,timers,stopwatches'}).then((user) => {
        this.set('user', user);
        user.loadHomeRegion();
        //get the current user's projects
        return this.get('store').query('project',
        {
          filter: { user_id: user.id },
          include: 'genres,challenges,project-challenges'
        }).then(() => {
            //get the current user's buddies and regions
            return this.get('store').query('group-user',
            {
              filter: { user_id: user.id },
              group_types: 'buddies',
              include: 'user,group'
            }).then(() => {
              t.delayUntilGroupsLoaded();
            });
          });
      });
    } else {
      return resolve();
    }
  },
  
  delayUntilGroupsLoaded() {
    let t = this;
    later(function() {
      if (t.get('store').peekAll('group').length>0) {
        t.set('isLoaded',true);
      } else {
        t.delayUntilGroupsLoaded();
      }
    }, 1000);
    
  },
  
  reloadBuddies() {
    // reload the user's buddies
    //return this.get('user').hasMany('groups').reload();
    return this.get('store').query('group-user',
    {
      filter: { user_id: this.get('user').id },
      group_types: 'buddies',
      include: 'user,group'
    }).then(data=>{
      // keep track of the ids for returned content
      let newIds = [];
      data.content.forEach((gu)=>{
        newIds.push(gu.id);
      });
      // unload any of this users buddy group_users that have an id not in the newIds
      this.get('user').buddyGroupUsers.forEach(bgu=>{
        if (newIds.indexOf(bgu.id)==-1) {
          // no longer a buddy
          bgu.unloadRecord();
        }
      });
    });
    
  }
});
