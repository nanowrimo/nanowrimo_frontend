import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Service.extend({
  currentUser: service(),
  store: service(),
  session: service(),
  recomputeBadges: -1,
  baseBadgesLoaded: null,
  load() {
    debounce(this, this.getBaseBadgeData, 2000, false);
  },
  
  getBaseBadgeData() {
    let t = this;
    this.get('store').query('badge',{}).then(function() {
      t.set('baseBadgesLoaded', true);
    });
  },
  
  checkForUpdates() {
    let t = this;
    let u = this.get('currentUser.user');
    if (u) {
      let uId = u.id;
      // clear the user's badges?
      let userBadges = this.store.peekAll('user-badge');
      userBadges.forEach((ub)=>{
        if (ub.user_id == uId) {
          this.store.unloadRecord(ub);
        }
      });
      this.store.query('user-badge', {
        filter: {
          user_id: uId
        }
      }).then(function() {
        t.incrementRecomputeBadges();
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
  
  incrementRecomputeBadges() {
    let rb  = this.get('recomputeBadges')+1;
    this.set('recomputeBadges',rb);
  },
  
  checkForPrimaryProjectChange: observer('currentUser.user.primaryProject', function(){
    // user's primary project has changed, refresh badge data 
    this.checkForUpdates();
  }),
});
