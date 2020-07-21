import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";
import moment from "moment"

export default Component.extend({
  currentUser: service(),
  store: service(),
  progressUpdaterService: service(),

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
  projectSelected: 0,
  open: true,
  
  // Returns the distance the project list should scroll to show the selected project
  scrollDistance: computed('projectSelected', function() {
    let ps = this.get('projectSelected');
    let dist = -ps*104;
    return htmlSafe('margin-top: '+dist+'px');
  }),
  
  countTypeTotalSelected: computed('currentUser.user.settingSessionCountBySession', function(){
    let setting = this.get('currentUser.user.settingSessionCountBySession');
    return setting===-1;  
  }),
  
  countTypeGoalTotalSelected: computed('currentUser.user.settingSessionCountBySession', function(){
    let setting = this.get('currentUser.user.settingSessionCountBySession');
    return setting===0;  
  }),
  
  countTypeSessionSelected: computed('currentUser.user.settingSessionCountBySession', function(){
    let setting = this.get('currentUser.user.settingSessionCountBySession');
    return (setting===1);  
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

  activeProjects: computed("user.activeProjects.{[]}", function(){
    let allProjects = this.get('user.activeProjects');
    let aps = [];
    allProjects.forEach(function(p) {
      if (p.activeProjectChallenge) {
        aps.push(p);
      }
    });
    return aps;
  }),
  
  hasMultipleProjects: computed("activeProjects.[]", function() {
    let aps = this.get('activeProjects');
    if (aps.length>1) {
      return true;
    } else {
      return false;
    }
  }),
  
  primaryProject: computed('activeProjects', 'projectSelected', function(){
    let aps = this.get('activeProjects');
    let ps = this.get('projectSelected');
    return aps[ps];
  }),
  
  init() {
    this._super(...arguments);
    let user = this.get('currentUser.user');
    this.set('user',  user);
    let cbs = user.settingSessionCountBySession;
    this.set('countType', cbs);
    
    // count by session?
    /*let cbs = user.settingSessionCountBySession;
    this.set('countType', cbs);  
    switch(cbs) {
      case -1:
      this.set('countValue', this.get("primaryProject.unitCount"));
      break;
    
      case 0: {
        let c = this.get("activeProjectChallenge.count");
        //let cc = this.get("activeProjectChallenge.currentCount");
        this.set('countValue', c);
        //this.set('countValue', (c > cc) ? c:cc);
        break;
      }
      case 1: 
      this.set('countValue', 0);
    }*/
    //this.resetCount();
    

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
    // If a specific project has been pre-specified
    let aps = this.get('activeProjects');
    let pus = this.get('progressUpdaterService');
    let dpid = pus.defaultProjectId;
    let pSelected = 0;
    if (dpid) {
      for (let i=0; i<aps.length; i++) {
        if (aps[i].id===dpid) {
          pSelected = i;
        }
      }
    } else {
      // Set the default primary project
      let highestCount = -1;
      for (let i=0; i<aps.length; i++) {
        if (aps[i].primary>highestCount) {
          highestCount = aps[i].primary
          pSelected = i;
        }
      }
    }
    this.set('projectSelected', pSelected);
    this.resetCount();
  },
  
  resetCount() {
    let cbs = this.get('countType');
    switch(cbs) {
      case -1:
      this.set('countValue', this.get("primaryProject.unitCount"));
      break;
  
      case 0: {
        let c = this.get("activeProjectChallenge.count");
        //let cc = this.get("activeProjectChallenge.currentCount");
        this.set('countValue', c);
        //this.set('countValue', (c > cc) ? c:cc);
        break;
      }
      case 1: 
      this.set('countValue', 0);
    }
    
  },

  actions: {
    
    onShow() {
    },
    
    onHidden() {
    },
    
    projectPrevious() {
      let ps = this.get('projectSelected');
      let ap = this.get('activeProjects');
      let newps = ps - 1;
      if (newps<0) { newps=ap.length-1; }
      this.set('projectSelected',newps);
      this.resetCount();
    },
    
    projectNext() {
      let ps = this.get('projectSelected');
      let ap = this.get('activeProjects');
      let newps = ps + 1;
      if (newps>=ap.length) { newps=0; }
      this.set('projectSelected',newps);
      this.resetCount();
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
          if ( this.get('selectedWhere')==null ) {
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
          if ( this.get('selectedHow')==null ) {
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
        //let hhmmStart;
        //let hhmmEnd;
        let yyyymmddStart;
        if (rs) {
          //let ms = moment(rs);
          //hhmmStart = ms.format("HH:mm");
          let me = moment(re);
          //hhmmEnd = me.format("HH:mm");
          yyyymmddStart = me.format("YYYY-MM-DD");
        } else {
          let m = moment();
          //hhmmEnd = m.format("HH:mm");
          m.subtract(1, 'h');
          //hhmmStart = m.format("HH:mm");
          yyyymmddStart = m.format("YYYY-MM-DD");
        }

        //get the time in HH:MM format and set that as the whenend
        //this.set("whenEnd", hhmmEnd);

        //get the time in HH:MM format and set that as the whenStart
         //this.set("whenStart", hhmmStart);

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
      // Variable for tracking whether more info should default to open
      let moreInfo = 0;
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
      let project = this.get('store').peekRecord('project', this.get('primaryProject.id') );
      //create a session for the primary project
      let session = this.get('store').createRecord('projectSession');
      session.set('project', project);
      session.set('projectChallenge', this.get('activeProjectChallenge'));
      session.set('unitType', 0);
      
      //check for other metrics
      session.set('feeling', this.get('selectedFeeling'));
      if (this.get('selectedWhere') ) {
        session.set('where', this.get('selectedWhere').value);
        moreInfo = 1;
      }
      if (this.get('selectedHow') ) {
        session.set('how', this.get('selectedHow').value);
        moreInfo = 1;
      }
      //fiddle with the dates
      let end = this.get('whenEnd');
      let start = this.get('whenStart');
      // have start and end been set?
      if (end) {
        moreInfo = 1;
        //get "today"
        let today = moment();
        let ymd = today.format('YYYY-MM-DD');
        let endDate = moment(ymd+" "+end).toDate();
        session.set('end', endDate);
      }
      if (start) {
        moreInfo = 1;
        //get "today"
        let today = moment();
        let ymd = today.format('YYYY-MM-DD');
        let endTime = null;
        if (end) {
          endTime = moment(end).format("HH:mm");
        } else {
          let m = moment();
          endTime = m.format("HH:mm");
        }
        let startTime = moment(start).format("HH:mm");
        if (startTime > endTime) {
          //start was yesterday
          let yesterday = today.subtract(1, 'd');
          ymd = yesterday.format('YYYY-MM-DD');
        }
        let startDate = moment(ymd+" "+start).toDate();
        session.set('start', startDate);
      }
      
      session.set('count', count);
      session.save();
      
      let user = this.get('currentUser.user');
      // check if the user has changed the counting type
      user.set("settingSessionCountBySession", this.get('countType'));
      // check if the user is entering more data
      user.set("settingSessionMoreInfo", moreInfo);
      //user.set("settingSessionMoreInfo", this.get("_projectAdditionalInfoShow"));
      let isDirty = user.get('hasDirtyAttributes');
      if (isDirty) {
        //save the user
        user.save();
      }
      
      let cfa = this.get('closeFormAction');
      cfa();
      return true;
    }
    
  }
});
