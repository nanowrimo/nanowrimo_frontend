import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Service.extend({
  currentUser: service(),
  store: service(),
  recomputeBadges: 0,

  load() {
    return this.get('store').query('badge',{});
    debounce(this, this.checkForUpdates, 15000, false);
  },
  
  checkForUpdates() {
    console.log('checking for badges');
    let u = this.get('currentUser.user');
    let nprb = this.get('parentRecomputeBadges');
    let recompute = false;
    this.store.query('user-badge', {
      filter: {
        user_id: u.get('id')
      }
    }).then(function() {
      recompute = true;
    });
    if (recompute) {
      this.set('parentRecomputeBadges',nprb+1);
    }
    debounce(this, this.checkForUpdates, 15000, false);
  },
  
  incrementRecomputeBadges() {
    let rb  = this.get('recomputeBadges')+1;
    this.set('recomputeBadges',rb);
  },
});