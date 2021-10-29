import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { computed, observer }  from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import moment from "moment"

export default Service.extend({
  session: service(),
  currentUser: service(),
  store: service(),
  badgesService: service(),
  recomputeNotifications: 0,
  lastCheck: null,
  notifiedBadgeIds: null,

  init() {
    this._super(...arguments);
    // set the notifiedBadgeIds to an empty array
    this.set('notifiedBadgeIds', []);
    // Setting the router so transitionTo is available to service
    this.set('router', getOwner(this).lookup('router:main'));
  },
  
  checkForUpdates() {
    console.log('checking');
    let t = this;
    let nva = this.get('currentUser.user.notificationsViewedAt');
    this.set('lastCheck',nva);
    this.store.findAll('notification',{ reload: true }).then(function() {
      t.incrementRecomputeNotifications();
      
    });
    debounce(this, this.checkForUpdates, 20000, false);
  },
  
  notificationClicked(notification){
    // Set a variable to be returned
    let r = [];
    if(notification.actionType=='BADGE_AWARDED') {
      //get the badge
      let id = notification.actionId;
      // get some badge data from the store
      let badge = this.get('store').peekRecord('badge', id);
      r.push(badge);
      //is this a winner badge?
      if (badge.winner){
        //NaNo Winner!
        r.push('showWinnerSplash');
      } else {
        //display the splash
        r.push('showBadgeSplash');
      }
      r.push(notification.extraData);
    }
    if(notification.actionType=='BUDDIES_PAGE') {
      this.get('router').transitionTo('authenticated.users.show.buddies', this.get('currentUser.user.slug'), { queryParams: { showRequests: true }});
    }
    if(notification.actionType=='GROUPS_PAGE') {
      this.get('router').transitionTo('authenticated.users.show.groups', this.get('currentUser.user.slug'));
    }
    if(notification.actionType=='NANOMESSAGES') {
      this.get('router').transitionTo('authenticated.nanomessages');
    }
    if(notification.actionType=='PROJECTS_PAGE') {
      this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
    }
    if(notification.actionType=='EVENT_PAGE') {
      let url = notification.redirectUrl;
      window.location.replace(url);
    }
    return r;
  },
  
  incrementRecomputeNotifications() {
    let rb  = this.get('recomputeNotifications')+1;
    this.set('recomputeNotifications',rb);
  },
  
  newNotificationsCount: computed('recomputeNotifications', function() {
    const recomputeNotifications = this.get('recomputeNotifications');
    var count = 0;
    var new_badge = false;
    if (recomputeNotifications) {
      console.log("new count");
      var ns = this.store.peekAll('notification');
      var lc = this.get('lastCheck');
      // self will need to be referenced later
      let _this=this;
      // get the array of badge ids
      let notifiedBadgeIds = this.get('notifiedBadgeIds');
      ns.forEach(function(obj) {
        if ((obj.displayAt>lc)&&(obj.displayStatus==1)) {
          console.log ("notif update " + obj.actionType);
          count += 1;
          if (obj.actionType=="BADGE_AWARDED") {
            //alert('badge added');
            // is the badges id NOT in the notifiedBadgeIds array?
            if (!notifiedBadgeIds.includes(obj.id)){
              // the badge is new
              new_badge = true;
              // add the badge's id to the array
              notifiedBadgeIds.push(obj.id);
              _this.set('notifiedBadgeIds', notifiedBadgeIds);
            }
          }
        }
      });
    }
    
    if (new_badge) {
      this.get('badgesService').checkForUpdates();
    }
    return count;
  }),
  
  newNanomessagesCount: computed('recomputeNotifications', function() {
    var ns = this.store.peekAll('notification');
    var count = 0;
    ns.forEach(function(obj) {
      // If this notification is about nanomessages
      if (obj.actionType=='NANOMESSAGES') {
        // Add the data count to the total
        count += obj.dataCount;
      }
    });
    return count;
  }),
  
  observePrimaryProject: observer('currentUser.user.primaryProject', function(){
    // clear the notifiedBadgeIds array
    this.set('notifiedBadgeIds',[]);
  }),
  
  notificationsViewed() {
    let u = this.get('currentUser.user');
    let nva = this.get('currentUser.user.notificationsViewedAt');
    let now = moment();
    //let dt = now.format("YYYY-MM-DD hh:mm:ss");
    this.set('lastCheck',nva);
    u.set('notificationsViewedAt',now.toDate());
    u.save().then(function() {
    });
  },
  
});
