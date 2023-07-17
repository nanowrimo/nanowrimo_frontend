import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  store: service(),
  currentUser: service(),
  statsParams: service(),
  router: service(),
  group: null,
  event: null,
  status: null,
  recomputeEvents: 0,
  showConfirmDelete: false,
  
  classNames: ['nw-card','event-card'],
  
  // Returns true if the current user has editing rights on this event
  canEditEvent: computed("group.id", "currentUser.user.id",'event.id', function(){
    let cu = this.get("currentUser.user");
    let group = this.get('group');
    let event = this.get('event');
    if (group && cu && event) {
      if (cu.adminLevel > 0) {
        return true;
      } else {
        // is the current user's id in the group's adminids?
        if (group.adminIds.indexOf(cu.id) > -1) {
          return true;
        }
        return event.userId == cu.id;
      }
    }
  }),
  hasAccessInfo: computed('event', function(){
    //return true if the group has venueDetails or accessible anything
    let event = this.get('event');
    if (event.accessMobility || event.accessLgbt || event.accessSize || event.accessAge || event.accessPathogen || event.accessPrice || event.accessCaptioning) {
      return true;
    }
  }),
  
  hasVenueDetails: computed("event", function() {
    let event = this.get('event');
    if ( event.venueDetails ) {
      return true;
    }
  }),
  
  init() {
    this._super(...arguments);
    let name = this.get('event.name');
    this.set('cancelConfirmationYesText', 'Yes, cancel it');
    this.set('cancelConfirmationNoText', 'No, thanks'); 
    this.set('cancelConfirmationTitleText', 'Confirm Event Cancellation');
    this.set('cancelConfirmationQuestion', `Do you really want to cancel "${name}"? It will continue to be displayed, but stamped with the word "Cancelled". Users who signed up will be notified of the event cancellation.`);
    this.set('restoreConfirmationYesText', 'Yes, restore it');
    this.set('restoreConfirmationNoText', 'No, thanks'); 
    this.set('restoreConfirmationTitleText', 'Confirm Event Restoration');
    this.set('restoreConfirmationQuestion', `Do you really want to restore "${name}"? The "cancelled" stamp will be removed, and users who signed up will be notified of the event restoration.`);
    this.set('deleteConfirmationYesText', 'Yes, delete it');
    this.set('deleteConfirmationNoText', 'No, thanks'); 
    this.set('deleteConfirmationTitleText', 'Confirm Event Deletion');
    this.set('deleteConfirmationQuestion', `Do you really want to delete "${name}"? This will delete both the event and any record of which users signed up. Users who signed up will NOT be notified of the event deletion.`);
    
    let e = this.get('event.approvedById');
    if ((e==0)||(e==null)) {
      this.set('status','pending');
    } else {
      let dt = moment(this.get('event.endDt'));
      let now = moment();
      if (dt>now) {
        this.set('status','upcoming');
      } else {
        this.set('status','past');
      }
    }
  },
  
  // Returns the start date as a readable string
  //startDateTime: computed(function() {
    //return moment(this.get('event.startDt')).format("dddd, MMMM D, YYYY") + ", from " + moment(this.get('event.startDt')).format("h:mm a") + " to " + moment(this.get('event.endDt')).format("h:mm a");
  //}),
  // Returns the start date as a readable string
  startDateTime: computed('event.[startDt,timeZone]', function() {
    let etz = this.get('event.timeZone'); 
    let utz = this.get('currentUser.user.timeZone');
    if (etz==utz) {
      return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd, MMM D, YYYY") + ", at " + moment(this.get('event.startDt')).tz(etz).format("h:mm a z");
    } else {
      return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd, MMM D, YYYY") + ", at " + moment(this.get('event.startDt')).tz(etz).format("h:mm a z") + " (" + moment(this.get('event.startDt')).tz(utz).format("h:mm a z") + ")";
    }
  }),
  
  
  duration: computed('event.startDt', 'eventendDt', function() {
    let start = moment(this.get('event.startDt'));
    let end = moment(this.get('event.endDt'));
    let diff = end.diff(start);
    return moment.utc(diff).format("H:mm");
  }),
  
  // Returns true if the event has been cancelled
  isCancelled: computed('event.cancelledById',function() {
    let c = this.get('event.cancelledById');
    return (c>0);
  }),
  
  // Returns the start date as a readable string
  startMo: computed(function() {
    return moment(this.get('event.startDt')).format("MMM");
  }),

  // Returns the start date as a readable string
  startDate: computed('event.startDt', function() {
    return moment(this.get('event.startDt')).format("D");
  }),
  
  locationAddress: computed('event',function() {
    let store = this.get('store');
    let lgs = store.peekAll('location_group');
    let e = this.get('event');
    let id = e.id;
    let s = null;
    lgs.forEach((lg) => {
      if ((id==lg.group_id)&&(lg.primary==1)&&(lg.id != null)) {
        let l = store.peekRecord('location',lg.location_id);
        if (l) {
          s = l.formatted_address;
        }
      }
    });
    return s;
  }),
  
  locationName: computed('event',function() {
    let store = this.get('store');
    let lgs = store.peekAll('location_group');
    let e = this.get('event');
    let id = e.id;
    let s = null;
    lgs.forEach((lg) => {
      if ((id==lg.group_id)&&(lg.primary==1)&&(lg.id != null)) {
        let l = store.peekRecord('location',lg.location_id);
        if (l) {
          s = l.name;
        }
      }
    });
    return s;
  }),
  
  groupUsersFound: computed(function() {
    let store = this.get('store');
    let gus = store.peekAll('group_user');
    return (gus.length>0);
  }),
  
  isEnrolled: computed('event', 'groupUsersFound','recomputeEvents', function() {
    let store = this.get('store');
    let gus = store.peekAll('group_user');
    let eid = this.get('event.id');
    let uid = this.get('currentUser.user.id');
    let found = false;
    gus.forEach((gu) => {
      if ((eid==gu.group_id)&&(gu.user_id == uid)) {
        found = true;
      }
    });
    return found;
  }),
  doJoin() {
    let e = this.get('event');
    let eid = this.get('event.id');
    let u = this.get('currentUser.user');
    let uid = this.get('currentUser.user.id');
    let gu = this.get('store').createRecord('group_user');
    gu.set("group_id",eid);
    gu.set("group",e);
    gu.set("user_id",uid);
    gu.set("user",u);
    gu.set("primary",0);
    gu.set("isAdmin",false);
    gu.set("entryMethod",'join');
    gu.save().then(()=>{
      // Increment recompute location
      let re = this.get('recomputeEvents');
      this.set('recomputeEvents',re+1);
    });
  },
    
  leaveGroup() {
    let cu = this.get('currentUser.user');
    //let g = this.get('groupContainer.groupObject');
    let e = this.get('event');
    let eid = this.get('event.id');
    let gu = null;
    cu.groupUsers.forEach(function(obj) {
      if (obj.group_id==eid) {
        gu = obj;
      }
    });
    if (gu) {
      gu.deleteRecord();
      gu.save().then(() => {
        cu.get('groupUsers').removeObject(gu);
        e.get('groupUsers').removeObject(gu);
        cu.get('groups').removeObject(e);
        e.get('users').removeObject(cu);
        // Increment recompute location
        let re = this.get('recomputeEvents');
        this.set('recomputeEvents',re+1);
      });
    }
  },
    
  doApprove() {
    let e = this.get('event');
    let uid = this.get('currentUser.user.id');
    e.set("approvedById",uid);
    e.save().then(()=>{
      // Increment recompute location
      let re = this.get('recomputeEvents');
      this.set('recomputeEvents',re+1);
      this.set('status','upcoming');
    });
  },

  doCancel() {
    let e = this.get('event');
    let uid = this.get('currentUser.user.id');
    e.set("cancelledById",uid);
    e.save().then(()=>{
      // Increment recompute location
      let re = this.get('recomputeEvents');
      this.set('recomputeEvents',re+1);
      this.set('status','upcoming');
    });
  },
  
  doRestore() {
    let e = this.get('event');
    e.set("cancelledById",0);
    e.save().then(()=>{
      // Increment recompute location
      let re = this.get('recomputeEvents');
      this.set('recomputeEvents',re+1);
      this.set('status','upcoming');
    });
  },
  
  doDelete() {
    // Get the event
    let e = this.get('event');
    // Get the parent groupId from the event
    let gid = e.get('groupId');
    // Get the store for local use
    let s = this.get('store');
    // Find the parent groupId in the store
    let p = s.peekRecord('group',gid);
    // Define the url var
    let url = "/";
    // If the record is found
    if (p.slug) {
      // Set the url to the region's upcoming events
      url = "/regions/" + p.slug + "/events/upcoming";
    }
    // Destroy the record
    this.get('event').destroyRecord().then(()=>{
      // Then redirect to a page with content
      window.location.replace(url);
    });
  },
  
  
  actions: {
    openNewEventModal() {
      if (this.get('canEditEvent')) {
        this.set('editEvent', true);
      }
    },
    confirmCancel(){
      //show the delete dialog
      this.set('showConfirmCancel', true);
    },
    cancelConfirmationYes(){
      this.doCancel();
      //close the modal
      this.set('showConfirmCancel', false);
    },
    cancelConfirmationNo(){
      //close the modal
      this.set('showConfirmCancel', false);
    },
    confirmRestore(){
      //show the delete dialog
      this.set('showConfirmRestore', true);
    },
    restoreConfirmationYes(){
      this.doRestore();
      //close the modal
      this.set('showConfirmRestore', false);
    },
    restoreConfirmationNo(){
      //close the modal
      this.set('showConfirmRestore', false);
    },
    confirmDelete(){
      //show the delete dialog
      this.set('showConfirmDelete', true);
    },
    deleteConfirmationYes(){
      this.doDelete();
      //close the modal
      this.set('showConfirmDelete', false);
    },
    deleteConfirmationNo(){
      //close the modal
      this.set('showConfirmDelete', false);
    },
    joinEvent() {
      this.doJoin();
    },
    leaveEvent() {
      this.leaveGroup();
    },
    approveEvent() {
      this.doApprove();
    },
    rejectEvent() {
      // set the event to be approvedById of -1
      let e = this.get('event');
      let uid = -1;
      e.set("approvedById",uid);
      e.save().then(()=>{
        let r = this.get('router');
        r.transitionTo('authenticated.regions.show.events.pending');
      });
    },
  }
});
