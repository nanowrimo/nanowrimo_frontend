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
  classNames: ['nw-card','event-card'],
  
  init() {
    this._super(...arguments);
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
  startDateTime: computed(function() {
    let etz = this.get('event.timeZone');
    let utz = this.get('currentUser.user.timeZone');
    if (etz==utz) {
      return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd, MMM D, YYYY") + ", at " + moment(this.get('event.startDt')).tz(etz).format("h:mm a z");
    } else {
      return moment(this.get('event.startDt')).tz(this.get('event.timeZone')).format("dddd, MMM D, YYYY") + ", at " + moment(this.get('event.startDt')).tz(etz).format("h:mm a z") + " (" + moment(this.get('event.startDt')).tz(utz).format("h:mm a z") + ")";
    }
  }),
  
  
  duration: computed(function() {
    let start = moment(this.get('event.startDt'));
    let end = moment(this.get('event.endDt'));
    let diff = end.diff(start);
    return moment.utc(diff).format("H:mm");
  }),
  
  // Returns the start date as a readable string
  startMo: computed(function() {
    return moment(this.get('event.startDt')).format("MMM");
  }),

  // Returns the start date as a readable string
  startDate: computed(function() {
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
    
  doReject() {
    let e = this.get('event');
    let uid = -1;
    e.set("approvedById",uid);
    e.save().then(()=>{
      // Increment recompute location
      let re = this.get('recomputeEvents');
      this.set('recomputeEvents',re+1);
      this.set('status','rejected');
    });
  },
  
  actions: {
    joinEvent() {
      this.doJoin();
    },
    approveEvent() {
      this.doApprove();
    },
    rejectEvent() {
      this.doApprove();
    },
  }
});
