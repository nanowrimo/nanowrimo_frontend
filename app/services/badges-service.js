import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Service.extend({
  currentUser: service(),
  store: service(),
  recomputeBadges: 0,

  load() {
    debounce(this, this.checkForUpdates, 15000, false);
    return this.get('store').query('badge',{});
  },
  
  checkForUpdates() {
    //console.log('checking for badges');
    let t = this;
    let u = this.get('currentUser.user');
    let recompute = false;
    // is there a user?
    if (u) {
      this.store.query('user-badge', {
        filter: {
          user_id: u.get('id')
        }
      }).then(function() {
        //console.log('yo');
        recompute = true;
        t.incrementRecomputeBadges();
      });
    }
    debounce(this, this.checkForUpdates, 15000, false);
  },
  
  incrementRecomputeBadges() {
    let rb  = this.get('recomputeBadges')+1;
    this.set('recomputeBadges',rb);
    //console.log(rb);
    
  },
});
