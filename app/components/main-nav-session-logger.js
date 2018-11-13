import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from "@ember/object";
import moment from "moment"
import {isNull} from "lodash"
export default Component.extend({
  currentUser: service(),
  store: service(),

  closeFormAction: null,
  countType: 0,
  showForm: false,
  user: null,
  countValue: null,
  initialValue: null,
  selectedFeeling: null,
  selectedHow: null,
  selectedWhere: null,
  whenStart: null,
  whenEnd: null,
  writingLocations: null,
  writingMethods: null,
  referenceTimer: null,
  referenceStopwatch: null,
  _projectAdditionalInfoShow: false,
  activeProjectChallenge:null,

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
    p.activeProjectChallenge.then((data)=>{
      this.set('activeProjectChallenge', data);
    });
    return p;
  }),

  init() {
    this._super(...arguments);
    let user = this.get('currentUser.user');
    this.set('user',  user);

    this.set('countType',0);
    this.set('countValue', this.get("primaryProject.unitCount"));
    this.set('initialValue', this.get("primaryProject.unitCount"));
    let t = this.get('referenceEnd');
    let s = this.get('referenceStart');
    if(t && s){
      //there is a referenceTimer or stopwatch?
      //force the 'extra' stuff to be displayed

      this.set('_projectAdditionalInfoShow',false);
      this.send('toggleAdditionalInfo');
    }
    // load up the activeProjectChallenge
  },



  actions: {
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
        this.get('store').findAll('writingLocation')
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
        if (rs) {
          let ms = moment(rs);
          hhmmStart = ms.format("HH:mm");
          let me = moment(re);
          hhmmEnd = me.format("HH:mm");
        } else {
          let m = moment();
          hhmmEnd = m.format("HH:mm");
          m.subtract(1, 'h');
          hhmmStart = m.format("HH:mm");
        }

        //get the time in HH:MM format and set that as the whenend
        this.set("whenEnd", hhmmEnd);
        //subtract 1 hour from the moment

        //get the time in HH:MM format and set that as the whenStart
         this.set("whenStart", hhmmStart);
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
      } else if (v===0){
        this.set('countValue', this.get("primaryProject.unitCount"));
      }
    },
    formSubmit() {
      //what project are we actually dealing with?
      let project = this.get('store').peekRecord('project', this.get('primaryProject.id') );
      //create a session for the primary project
      let session = this.get('store').createRecord('projectSession');
      session.set('project', project);
      session.set('projectChallenge', this.get('activeProjectChallenge'));
      session.set('unitType', 0);
      let count = parseInt( this.get('countValue'));
      //do we need to determine the session count based on the total count?
      if (this.get('countType')===0) {
        //session count is based on total
        let iv = this.get("initialValue");
        count -= iv;
      }

      //check for other metrics
      session.set('feeling', this.get('selectedFeeling'));
      if (this.get('selectedWhere') ) {
        session.set('where', this.get('selectedWhere').value);
      }
      if (this.get('selectedHow') ) {
        session.set('how', this.get('selectedHow').value);
      }
      //fiddle with the dates
      let end = this.get('whenEnd');
      let start = this.get('whenStart');
      // have start and end been set?
      if (start && end) {
        //get "today"
        let today = moment();
        let ymd = today.format('YYYY-MM-DD');
        let endDate = moment(ymd+" "+end).toDate();
        if( start > end ) {
          //start was yesterday
          let yesterday = today.subtract(1, 'd');
          ymd = yesterday.format('YYYY-MM-DD');
        }
        let startDate = moment(ymd+" "+start).toDate();
        session.set('end', endDate);
        session.set('start', startDate);
      }

      session.set('count', count);
      session.save();
      let cfa = this.get('closeFormAction');
      cfa();

      return true;
    }
  }
});
