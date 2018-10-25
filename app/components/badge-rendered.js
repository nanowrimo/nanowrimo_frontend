import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  badge: null,
  projectChallenge: null,
  renderSize: null,
  renderSmall: computed('renderSize',function() {
    return this.get('renderSize')=='small';
  }),
  awarded: computed('badge',function() {
    let ubs = this.get('store').peekAll('user-badge');
    let b = this.get('badge');
    let awarded = false;
    let pc = this.get('projectChallenge');
    ubs.forEach(function(ub) {
      if ((b.id==ub.badge_id)&&(pc.id==ub.project_challenge_id)) {
        awarded = true;
      }
    });
    return awarded;
  }),
  badgeImageUrl: computed('awarded',function() {
    let b = this.get('badge');
    let imageUrl = b.unawarded;
    if (this.get('awarded')) {
      imageUrl = b.awarded;
    }
    return imageUrl;
  }),
  badgeDescription: computed('awarded',function() {
    let b = this.get('badge');
    let desc = b.description;
    if (this.get('awarded')) {
      desc = b.awarded_description;
    }
    return desc;
  }),
  badgeNote: computed('awarded',function() {
    let awarded = this.get('awarded');
    let badge = this.get('badge');
    let note = "";
    if (badge.badge_type=='self-awarded') {
      if (awarded) {
        note = "You gave yourself this badge. If you feel you don't deserve it, click on it to remove it.";
      } else {
        note = "Click on this badge to award it to yourself!";
      }
    }
    return note;
  }),
  
});