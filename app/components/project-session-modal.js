import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import {isNull} from "lodash";

export default Component.extend({
  currentUser: service(),
  store: service(),
  
  project: null,
  projectChallenge: null,
  // Session vars
  closeFormAction: null,
  countType: 0,
  showForm: false,
  user: null,
  countValue: null,
  selectedFeeling: null,
  selectedHow: null,
  selectedWhere: null,
  whenStart: null,
  whenEnd: null,
  dateStart: null,
  writingLocations: null,
  writingMethods: null,
  referenceTimer: null,
  referenceStopwatch: null,
  _projectAdditionalInfoShow: false,
  // End session vars
  
  // Session methods begin
  countTypeTotalSelected: computed('currentUser.user.settingSessionCountBySession', function(){
    //let setting = this.get('currentUser.user.settingSessionCountBySession');
    //return setting===-1;
    return false;
  }),
  
  countTypeGoalTotalSelected: computed('currentUser.user.settingSessionCountBySession', function(){
    //let setting = this.get('currentUser.user.settingSessionCountBySession');
    //return setting===0;
    return false;
  }),
  
  countTypeSessionSelected: computed('currentUser.user.settingSessionCountBySession', function(){
    //let setting = this.get('currentUser.user.settingSessionCountBySession');
    //return (setting===1);
    return true;
  }),
  
  
  activeProjectChallenge: computed('primaryProject', function(){
    return this.get('primaryProject.activeProjectChallenge');
  }),
  feeling1Selected: computed('selectedFeeling', function() {
    return this.get('selectedFeeling') == 1;
  }),
  feeling2Selected: computed('selectedFeeling', function() {
    return this.get('selectedFeeling') == 2;
  }),
  feeling3Selected: computed('selectedFeeling', function() {
    return this.get('selectedFeeling') == 3;
  }),
  feeling4Selected: computed('selectedFeeling', function() {
    return this.get('selectedFeeling') == 4;
  }),
  feeling5Selected: computed('selectedFeeling', function() {
    return this.get('selectedFeeling') == 5;
  }),

  projectAdditionalInfoShow: computed('_projectAdditionalInfoShow', function() {
    let p = this.get('_projectAdditionalInfoShow');
    if (p) {
      return "info-visible";
    } else {
      return "info-hidden";
    }
  }),
  primaryProject: computed("user.primaryProject", function(){
    let p = this.get('user.primaryProject');
    return p;
  }),
  
  dateMax: computed("projectChallenge", function(){
    //get the projectChallenge
    let pc = this.get('projectChallenge');
    // has the challenge ended?
    if (pc.hasEnded()) {
      //return the last day of the challenge
      return pc.endsAt;
    } else {
      //challenge is still ongoing, return today's date in user's tz
      let tz = this.get('currentUser.user.timeZone');
      let now = moment().tz(tz);
      return now.format("YYYY-MM-DD");
      
    }
  }),

  init() {
    this._super(...arguments);
    let user = this.get('currentUser.user');
    this.set('user',  user);
    // count by session?
    //let cbs = user.settingSessionCountBySession;
    let cbs = 1;
    this.set('countType', cbs);  
    switch(cbs) {
      case -1:
      this.set('countValue', this.get("primaryProject.unitCount"));
      break;
    
      case 0: {
        let c = this.get("activeProjectChallenge.count");
        let cc = this.get("activeProjectChallenge.currentCount");
        this.set('countValue', (c > cc) ? c:cc);
        break;
      }
      case 1: 
      this.set('countValue', 0);
    }
    this.set('countValue', 0);
    let t = this.get('referenceEnd');
    let s = this.get('referenceStart');
    //did the user previously select 'show more'?
    let ussmi = user.settingSessionMoreInfo;
    if((t && s) || ussmi){
      //there is a referenceTimer or stopwatch?
      //force the 'extra' stuff to be displayed

      this.set('_projectAdditionalInfoShow',false);
      this.send('toggleAdditionalInfo');
    }
    // load up the activeProjectChallenge
  },

  // Session methods end

  actions: {
    onShow() {
      // the modal is being shown
      //determine what should be displayed for date and times
      // is the projectChallenge still active?
      let pc = this.get('projectChallenge');
      if (pc.hasEnded()) {
        //set the session date to the last day of the event
        this.set('dateStart',pc.endsAt);
      } else {
        //set the session date to the current date for the user
        let tz = this.get('currentUser.user.timeZone');
        let now = moment().tz(tz);
        let formatted = now.format("YYYY-MM-DD");
        this.set('dateStart',formatted);
      }
      //set defaults for the times
      this.set('whenStart', "12:00");
      this.set('whenEnd', "13:00");
      
      //set the 'count' to zero
      this.set('countValue', 0);
    },
    
    // Session actions
    closeModal() {
       this.set('open', false);
    },
    
    changeFeeling(val){
      this.set("selectedFeeling", val);
    },
    createWhere(value) {
      //add this location to the DB
      let wl = this.get('store').createRecord('writingLocation', {name: value} );
      this.set('selectedWhere', wl);
      wl.save().then((result)=>{
        let obj = {"name": result.name, "value": result.id};
        this.get('writingLocations').pushObject(obj);
        this.set('selectedWhere', obj);
      });
    },
    createHow(value) {
      //add this location to the DB
      let record = this.get('store').createRecord('writingMethod', {name: value} );
       //select the new value
      this.set('selectedHow', record);
      record.save().then((result)=>{
        let obj = {"name": result.name, "value": result.id}
        this.get('writingMethods').pushObject(obj);
        this.set('selectedHow', obj);
      });
    },
    toggleAdditionalInfo() {
      let show = !this.get('_projectAdditionalInfoShow');
      this.set('_projectAdditionalInfoShow',show);
      if (show) {
        //get the writing locations
        this.get('store').findAll('writingLocation', { reload: true })
        .then((locations)=>{
          let names = locations.map((l)=>{return {"value": l.id, "name":l.name}});
          //set the whereList
          this.set('writingLocations', names);
          // if the selectedWhere is null, set it to 'laptop'
          if ( isNull(this.get('selectedWhere')) ) {
            for (var i = 0; i < names.length; i++ ){
              let w = names[i];
              if (w.name === "home" ) {
                this.set('selectedWhere', w);
                break;
              }
            }
          }

        });
        //get the writing methods
        this.get('store').findAll('writingMethod')
        .then((locations)=>{
          let names = locations.map((l)=>{return {"value": l.id, "name":l.name}});
          //set the whereList
          this.set('writingMethods', names);
          // if the selectedHow is null, set it to 'laptop'
          if ( isNull(this.get('selectedHow')) ) {
            for (var i = 0; i < names.length; i++ ){
              let w = names[i];
              if (w.name === "laptop" ) {
                this.set('selectedHow', w);
                break;
              }
            }
          }
        });
        // set the whenEnd and whenStart
        let rs = this.get('referenceStart');
        let re = this.get('referenceEnd');
        let hhmmStart;
        let hhmmEnd;
        let yyyymmddStart;
        if (rs) {
          let ms = moment(rs);
          hhmmStart = ms.format("HH:mm");
          let me = moment(re);
          hhmmEnd = me.format("HH:mm");
          yyyymmddStart = me.format("YYYY-MM-DD");
        } else {
          let m = moment();
          hhmmEnd = m.format("HH:mm");
          m.subtract(1, 'h');
          hhmmStart = m.format("HH:mm");
          yyyymmddStart = m.format("YYYY-MM-DD");
        }

        //get the time in HH:MM format and set that as the whenend
        this.set("whenEnd", hhmmEnd);

        //get the time in HH:MM format and set that as the whenStart
         this.set("whenStart", hhmmStart);

        //get the time in HH:MM format and set that as the whenStart
         this.set("dateStart", yyyymmddStart);
         
      } else {
        //nullify the whenEnd and whenStart
         this.set("whenEnd", null);
         this.set("whenStart", null);
      }

    },
    showCreateWhen() {
      return true;
    },

    cancel(){
      let cfa = this.get('closeFormAction');
      cfa();
    },
    selectChanged(v) {
      //convert the string to integer
      v = parseInt(v);
      this.set('countType',v);
      if (v === 1) {
        this.set('countValue', 0);
      } else if (v===-1){
        this.set('countValue', this.get("primaryProject.unitCount"));
      } else if (v===0){
        //set countValue to the activeProjectChallenge's count or currentCount whichever is higher
        let c = this.get("activeProjectChallenge.count");
        let cc = this.get("activeProjectChallenge.currentCount");
        if (cc == null) {
          this.set('countValue', c);
        } else {
          this.set('countValue', (c > cc) ? c:cc);
        }
      }
    },
    formSubmit() {
      // Get the current user's time zone
      let tz = this.get('currentUser.user.timeZone');
      
      //determine what 'count' we need to send to the API
      let count = parseInt( this.get('countValue'));
      //do we need to determine the session count based on the total count?
      let ct = this.get('countType');
      if (ct < 1) {
        //session count is based on some total total
        let initial = 0;
        //get the initial value based on countType
        if (ct==-1) {
          initial = this.get("primaryProject.unitCount");
        } else {
          initial = this.get("activeProjectChallenge.count");
        }
        count -= initial;
      }
      
      //what project are we actually dealing with?
      let project = this.get('project');
      let projectChallenge = this.get('projectChallenge');
      //let project = this.get('store').peekRecord('project', this.get('primaryProject.id') );
      //create a session for the primary project
      let session = this.get('store').createRecord('projectSession');
      session.set('project', project);
      session.set('projectChallenge', projectChallenge);
      //session.set('projectChallenge', this.get('activeProjectChallenge'));
      session.set('unitType', 0);
      
      //check for other metrics
      session.set('feeling', this.get('selectedFeeling'));
      if (this.get('selectedWhere') ) {
        session.set('where', this.get('selectedWhere').value);
      }
      if (this.get('selectedHow') ) {
        session.set('how', this.get('selectedHow').value);
      }
      let end = this.get('whenEnd');
      let start = this.get('whenStart');
      let dateStart = this.get('dateStart');
      // have start and end been set?
      if (start && end) {
        let ymd = dateStart;
        let startstr = ymd+" "+start + ":00";
        let endstr = ymd+" "+end + ":00";
        let startDate = moment.tz(startstr,tz).toDate();
        let endDate = moment.tz(endstr,tz).toDate();
        if( startDate > endDate ) {
          // Set the start date to one day earlier
          startDate = moment.tz(startstr,tz).subtract(1, 'd').toDate();
        }
        session.set('end', endDate);
        session.set('start', startDate);
      }

      session.set('count', count);
      session.save();
      
      let user = this.get('currentUser.user');
      // check if the user has changed the counting type
      user.set("settingSessionCountBySession", this.get('countType'));
      // check if the user is entering more data
      user.set("settingSessionMoreInfo", this.get("_projectAdditionalInfoShow"));
      let isDirty = user.get('hasDirtyAttributes');
      if (isDirty) {
        //save the user
        user.save();
      }
      
      //let cfa = this.get('closeFormAction');
      //cfa();
      this.set('open', false);
      return true;
    },
    hideForms: function() {
      this.set('open', false);
    },
    
    dateChange: function(event) {
      let val = event.target.value;
      let min = event.target.min;
      let max = event.target.max;
      if (val > max) {
        event.target.value = max;
      } else if (val < min) {
        event.target.value = min;
      }
    }
  }
});
