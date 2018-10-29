import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';
import { alias } from '@ember/object/computed';


export default Component.extend({
  currentUser: service(),
  store: service(),
  session: service(),
  badge: null,
  userBadgeEndpoint: `${ENV.APP.API_HOST}/user-badges/`,
  
  projectChallenge: null,
  user: null,
  renderSize: null,
  recomputeBadges: alias('parentRecomputeBadges'),
  userBadges: computed('recomputeBadges', function() {
    return this.get('store').peekAll('user-badge');
  }),
  userBadge: computed('userBadges.[]',function() {
    let ubs = this.get('userBadges');
    console.log(ubs.length);
    let b = this.get('badge');
    let ad = false;
    let pc = this.get('projectChallenge');
    ubs.forEach(function(ub) {
      if ((b.id==ub.badge_id)&&(pc.id==ub.project_challenge_id)) {
        ad = ub;
      }
    });
    return ad;
  }),
  
  // Returns true if the badge belongs to the current user
  ownsBadge: computed('currentUser','user',function() {
    if (this.get('currentUser.user.id')==this.get('user.id')) {
      return true;
    } else {
      return false;
    }
  }),
  
  // Returns true if badge should be rendered half-size
  renderSmall: computed('renderSize',function() {
    return this.get('renderSize')=='small';
  }),
  
  // Returns date if the badge has been won in the current context
  awardDate: computed('userBadge',function() {
    let ub = this.get('userBadge');
    let ad = false;
    if (ub) {
      ad = ub.created_at;
    }
    return ad;
  }),
  // Returns true if the user can award themselves the badge
  awardable: computed('badge.badge_type','ownsBadge',function() {
    let badge = this.get('badge');
    return ((badge.badge_type=='self-awarded')&&(this.get('ownsBadge')));// {
  }),
  
  // Changes the cursor on self-awardable badges
  clickableClass: computed('awardable',function() {
    if (this.get('awardable')) {
      return 'clickable';
    } else {
      return '';
    }
  }),
  
  
  badgeImageUrl: computed('userBadges.[]',function() {
    let b = this.get('badge');
    let imageUrl = b.unawarded;
    if (this.get('awardDate')) {
      imageUrl = b.awarded;
    }
    return imageUrl;
  }),
  badgeDescription: computed('userBadges.[]',function() {
    let b = this.get('badge');
    let desc = '';
    if (this.get('ownsBadge')) {
      if (this.get('awardDate')) {
        desc = b.awarded_description;
      } else {
        desc = b.description;
      }
    }
    return desc;
  }),
  badgeNote: computed('userBadges.[]',function() {
    let awardDate = this.get('awardDate');
    let badge = this.get('badge');
    let ownsBadge = this.get('ownsBadge');
    let note = "";
    if (ownsBadge) {
      if (badge.badge_type=='self-awarded') {
        if (awardDate) {
          note = "You gave yourself this badge. If you feel you don't deserve it, click on it to remove it.";
        } else {
          note = "Click on this badge to award it to yourself!";
        }
      } else {
        if (awardDate) {
          let str_val = moment(awardDate).fromNow(); 
          note = "You won this badge " + str_val + "."; 
        }
      }
    } else {
      if (awardDate) {
        let str_val = moment(awardDate).fromNow(); 
        note = this.get('user.name') + " won this badge " + str_val + "."; 
      }
    }
    return note;
  }),
  
  actions: {
    toggleBadge() {
      let badge = this.get('badge');
      let ownsBadge = this.get('ownsBadge');
      let note = "";
      if (ownsBadge) {
        if (badge.badge_type=='self-awarded') {
          if (this.get('awardDate')) {
            let ub = this.get('userBadge');
            ub.destroyRecord().then(() => {
              //this.set('userBadge',null);
              let rb = this.get('recomputeBadges') + 1;
              this.set('recomputeBadges',rb);
              
            });
          } else {
            let store = this.get('store');
            let ub = store.createRecord('user-badge', {
              user_id: this.get('currentUser.user.id'),
              badge_id: this.get('badge.id'),
              project_challenge_id: this.get('projectChallenge.id'),
            });
            ub.save().then(() => {
              //this.set('userBadge',ub);
              let rb = this.get('recomputeBadges') + 1;
              this.set('recomputeBadges',rb);
            });
          }
        }
      }
    },
  }
  
  
});