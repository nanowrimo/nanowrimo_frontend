import NanoSubcard from 'nanowrimo/components/nano-subcard';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
export default NanoSubcard.extend({
  store: service(),
  badgesService: service(),
  cardTitle: null,
  badgeType: null,
  user: null,
  projectChallenge: null,
  parentRecomputeBadges: 0,
  init() {
    this._super(...arguments);
  },
  checkForUpdates() {
    let u = this.get('user');
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
  },
  badges: computed('badgeType','parentRecomputeBadges', function() {
    
    let bt = this.get('badgeType');
    let bs = this.get('store').peekAll('badge');
    let newbs = [];
    bs.forEach(function(badge) {
      if (badge.badge_type==bt) {
        newbs.push(badge);
      }
    });
    return newbs;
  }),
  firstBadge: computed('badges', function() {
    let bs = this.get('badges');
    return bs[0];
  }),
});