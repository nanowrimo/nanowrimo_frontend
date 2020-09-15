import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,
  isLoaded: false,
  load() {
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
            user.loadGroupUsers('buddies,regions');
          });
      });
    } else {
      return resolve();
    }
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
