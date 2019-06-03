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
  
  // Returns the browser width
  browserWidth: computed(function() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }),
  
  honeycombHeight: computed('badges', function() {
    let bs = this.get('badges');
    let bw = this.get('browserWidth');
    let tag = "height: " + (bs.length*45) + "px";
    if (bw > 600) {
      tag = "height: " + (bs.length*20) + "px";
    }
    return tag.htmlSafe();
  }),
});