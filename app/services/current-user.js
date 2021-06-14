import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';
import { later } from '@ember/runloop';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,
  isLoaded: false,
  load() {
    let t = this;
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user',
      { current: true, include: 'projects,timers,stopwatches'}).then((user) => {
        this.set('user', user);
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
              /*later(function() {
                if (this.get('store').peekAll('group').length>0) {
                  t.set('isLoaded',true);
              }, 500);*/
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
        t.user.set('groupUsersLoaded',true);
      } else {
        t.delayUntilGroupsLoaded();
      }
    }, 1000);
    
  },
  
  checkForRegionUpdates() {
    let u = this.get('user');
    if (u) {
      this.store.query('group-user', {
        filter: {
          user_id: u.get('id')
        },
        group_types: 'region'
      }).then(function() {
        let newInt = u.get('recalculateHome') + 1;
        u.set('recalculateHome', newInt);
      }).catch((error)=>{
        for (var i=0; i<error.errors.length; i++) {
          let e = error.errors[i];
          if (e.status=="401") {
            //authorization has failed, de-auth now
            this.get('session').invalidate();
            break;
          }
        }
      });
    }
  },
  
});
