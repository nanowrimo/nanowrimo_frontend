import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Service.extend({
  currentUser: service(),
  store: service(),
  session: service(),
  recomputeBadges: -1,

  load() {
    debounce(this, this.getBaseBadgeData, 2000, false);
  },
  
  getBaseBadgeData() {
    let t = this;
    this.get('store').query('badge',{}).then(function() {
      debounce(t, t.checkForUpdates, 1000, false);
    });
  },
  
  checkForUpdates() {
    let t = this;
    let u = this.get('currentUser.user');
    if (u) {
      this.store.query('user-badge', {
        filter: {
          user_id: u.get('id')
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
});
