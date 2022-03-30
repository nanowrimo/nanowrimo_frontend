import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),
  store: service(),
  router: service(),
  group: null,
  event: null,
  status: null,
  recomputeEvents: 0,
  editEvent: false,
  classNames: ['nw-event-promo'],
  isHq: null,
  
  init() {
    this._super(...arguments);
  },
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
  
  // Returns true if the event has been cancelled
  isCancelled: computed('event.cancelledById',function() {
    let c = this.get('event.cancelledById');
    return (c>0);
  }),
  
  // Returns the start date as a readable string
  startDateTime: computed(function() {
    let etz = this.get('event.timeZone');
    let utz = this.get('currentUser.user.timeZone');
    if (etz==utz) {
      return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd, MMM D, YYYY") + ", at " + moment(this.get('event.startDt')).tz(etz).format("h:mm a z");
    } else {
      return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd, MMM D, YYYY") + ", at " + moment(this.get('event.startDt')).tz(etz).format("h:mm a z") + " (" + moment(this.get('event.startDt')).tz(utz).format("h:mm a z") + ")";
    }
  }),
  
  // Returns the start monthte as a readable string
  startMonth: computed(function() {
    return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("MMM");
  }),
  
  // Returns the start date as a readable string
  startDate: computed(function() {
    return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("D");
  }),
  
  // Returns the start date as a readable string
  startDay: computed(function() {
    return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd");
  }),
  
  // Returns the start date as a readable string
  eventTime: computed(function() {
    let etz = this.get('event.timeZone');
    return (moment(this.get('event.startDt')).tz(etz).format("h:mm") + " to " + moment(this.get('event.endDt')).tz(etz).format("h:mm a z"));
  }),
  
  duration: computed(function() {
    let start = moment(this.get('event.startDt'));
    let end = moment(this.get('event.endDt'));
    let diff = end.diff(start);
    return moment.utc(diff).format("H:mm");
  }),

  groupSlug: computed("isHq", "group", function(){
    if (this.get('isHq')){
      return "nanowrimo-hq";
    } else {
      return this.get('group.slug');
    }
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
    
    
  actions: {
    joinEvent() {
      this.doJoin();
    },
  }
});
