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
    let t = this;
    let u = this.get('currentUser.user');
    this.store.query('user-badge', {
      filter: {
        user_id: u.get('id')
      }
    }).then(function() {
      t.incrementRecomputeBadges();
    });
    debounce(this, this.checkForUpdates, 15000, false);
  },
  
  incrementRecomputeBadges() {
    let rb  = this.get('recomputeBadges')+1;
    this.set('recomputeBadges',rb);
  },
});