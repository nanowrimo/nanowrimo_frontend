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
              this.set('groupUsersLoaded', true);
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
  

});
