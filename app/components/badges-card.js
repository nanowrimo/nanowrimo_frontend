import NanoSubcard from 'nanowrimo/components/nano-subcard';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default NanoSubcard.extend({
  store: service(),
  cardTitle: null,
  badgeType: null,
  projectChallenge: null,
  badges: computed('badgeType', function() {
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