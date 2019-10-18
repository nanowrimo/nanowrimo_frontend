//import NanoSubcard from 'nanowrimo/components/nano-subcard';
import Component from '@ember/component';
import { computed }  from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
export default Component.extend({
  store: service(),
  badgesService: service(),
  cardTitle: null,
  badgeType: null,
  user: null,
  projectChallenge: null,
  parentRecomputeBadges: 0,
  init() {
    this._super(...arguments);
    //let bs = this.get('badgesService');
    //debounce(this, bs.checkForUpdates, 3000, false);
    
    //bs.checkForUpdates();
  },
  /*checkForUpdates() {
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
  },*/
  badges: computed('badgesService.recomputeBadges','badgeType','parentRecomputeBadges','user.userBadges.{[]}', function() {
    let rb = this.get('badgesService.recomputeBadges');
    let newbs = [];
    if (rb>=0) {
      let bt = this.get('badgeType');
      let bs = this.get('store').peekAll('badge');
      bs.forEach(function(badge) {
        if (badge.badge_type==bt) {
          newbs.push(badge);
        }
      });
    }
    return newbs;
  }),
  firstBadge: computed('badgesService.recomputeBadges','badges','parentRecomputeBadges','user.projects.{[],@each.primary}', function() {
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