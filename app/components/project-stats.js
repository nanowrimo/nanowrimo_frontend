import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),
  session: service(),
  store: service(),
  
  project: null,
  projectChallenge: null,
  projectChallenges: null,
  
  userUnitsToday: computed('projectChallenge','project.projectSessions.[]', function() {
    //now is a good time to update the whereIwrite
    this._updateWhereIWrite();
    var data = {
      name: this.get('currentUser.user.name'),
      countToday: this.get('todaysCount'),
      countPerDay: this.get('projectChallenge.countPerDay')
    };
    return data;
  }),
  
  hasDailyAggregates: computed('userDailyAggregates.[]', function(){
    let das = this.get('userDailyAggregates');
    if (das) {
      return true;
    }else{
      return false;
    }
  }),
  userDailyAggregates: computed('challengeSessions.[]', function() {
    let css = this.get('challengeSessions');
    let dates = this.get('projectChallenge.dates');
    if(dates) {
      let today = moment().format("YYYY-MM-DD");
      let todayFound = false;
      //create an aggregates array
      let aggs = {};
      for (var i = 0; i < dates.length; i++) {
        let key = dates[i];
        if (todayFound) {
          aggs[key] = null;
        } else {
          aggs[key] = 0;
        }
        if (key == today) {
          todayFound = true;
        }
      }
      
      //loop the sessions
      css.forEach((cs)=>{
        var k = moment(cs.createdAt).format("YYYY-MM-DD");
        aggs[k]+=cs.count;
      });
      return aggs;
    }
  }),
  
  // determine which hours of the day the user is writing during 
  userHourAggregates: computed('challengeSessions.[]',function() {
    //get the sessions
    let hoursObject = Array(24);
    hoursObject.fill(0);
    let sessions = this.get('challengeSessions');
    //loop through the sessions
    sessions.forEach((s)=>{
      //is there a start and end?
      if(s.start && s.end) {
        let start = moment(s.start);
        let end = moment(s.end);
        //get the hour of the start
        var h1 = start.hour();
        var hn = end.hour();
        //how many hours are we dealing with?
        var numHours = 1 + (hn - h1);
        var countPerHour = s.count/numHours;
        for (var x = h1; x <= hn; x++) {
          hoursObject[x] += countPerHour;
        }
      } else {
        //TODO: get some data based on when the session was created 
        
      }
    });
    return hoursObject;
  }),
  
  // determine if there is data in the userHourAggregates
  hasHourAggregates: computed('userHourAggregates.[]', function(){
    let aggs = this.get('userHourAggregates');
    let retval = false;
    //loop!
    for (var i=0; i < aggs.length; i++) {
      if(aggs[i] > 0) {
        retval = true;
        break;
      }
    }
    return retval;
  }),
  userDailyTotals: computed('userDailyAggregates.[]', function() {
    let udas = this.get('userDailyAggregates');
    let dates = this.get('projectChallenge.dates');
    if(udas) {
      let totals = [];
      //loop through the dates 
      for(var i=0; i < dates.length; i++) {
        var date = dates[i];
        //if the date is in the future...
        if(moment(date).isAfter()) {
          break;
        }
        var val = udas[date];
        var tval = val;
        if(i > 0) {
          tval +=totals[i-1];
        }
        totals[i] = tval; 
      }
      return totals;
    }
  }),
  dailyAverage: computed('userDailyAggregates.[]', function(){
    let aggs = this.get('userDailyAggregates');
    if (aggs) {
      let values = Object.values(aggs);
      let sum = 0;
      for (var i=0 ; i < values.length ; i++) {
        let val = values[i];
        if(val==null) {
          break;
        }
        sum+=val;
      }
      let average = parseInt(sum/i)
      return average;
    }
  }),
  userPercentData: computed('projectChallenge','project.projectSessions.[]', function() {
    //create the data thingy for the current user 
    let percent = parseInt(this.get('count')*100/this.get('goal'));
    var data = {
      name: this.get('currentUser.user.name'),
      percent: percent
    };
    return data;
  }),
  
  goalDuration: computed('projectChallenge', function(){
    return this.get('projectChallenge.duration');
  }),
  goal: computed('projectChallenge', function(){
   return this.get('projectChallenge.goal'); 
  }),
  goalUnit: computed('projectChallenge', function() {
   return this.get('projectChallenge.unitTypePlural'); 
  }),
  goalUnitSingular: computed('projectChallenge', function() {
   return this.get('projectChallenge.unitTypeSingular'); 
  }),
  
  count: computed('challengeSessions','project.projectSessions.[]', function() {
    let sessions = this.get('challengeSessions');
    let sum = 0;
    if (sessions) {
      sessions.forEach((s)=>{ sum+= s.count});
    }
    return sum;
  }),
  
  //
  todaysSessions: computed('challengeSessions.[]', function() {
    let css = this.get('challengeSessions');
    let todays = [];
    let now = moment();
    css.forEach((cs)=>{
      if (moment(cs.createdAt).isSame(now, 'day') ) {
        todays.push(cs);
      }
    });
    return todays;
  }),
  
  todaysCount: computed('todaysSessions.[]', function() {
  let sum = 0;
  let ts = this.get('todaysSessions');
  ts.forEach((s)=>{
    sum+=s.count;
  });
  return sum;
  }),
  
  challengeSessions: computed('projectChallenge','project.projectSessions.[]', function() {
    let cStart = moment( this.get('projectChallenge.startsAt') );
    let cEnd = moment( this.get('projectChallenge.endsAt') );
    //get the projectSessions created during the projectChallenge
    let sessions = this.get('project.projectSessions');
    let newSessions = [];
    sessions.forEach((s)=>{
      var sCreated = moment(s.createdAt);
      if(cStart.isBefore(sCreated) && sCreated.isBefore(cEnd) ){
        newSessions.push(s);
      }
    });
    return newSessions;
  }),

  init(){
    this._super(...arguments);
    var p = this.get('currentUser.user.primaryProject');
    this.set('project', p);
    this.getProjectChallenges();
  },

  actions: {
    projectSelectChanged: function(v) {
      let projects = this.get('currentUser.user.projects'); 
      let len = projects.length;
      //loop through the current user's projects and find the matching ID
      for(var i=0; i<len; i++){
        let p = projects.objectAt(i);
        if (p.id == v) {
          this.set('project', p);
          this.getProjectChallenges();
          break;
        }
      }
    },
    challengeSelectChanged: function(v) {
      let pcs = this.get('project.projectChallenges'); 
      let len = pcs.length;
      //loop through the current user's projects and find the matching ID
      for(var i=0; i<len; i++){
        let pc = pcs.objectAt(i);
        if (pc.id == v) {
          this.set('projectChallenge', pc);
          break;
        }
      }
    }
  },

  getProjectChallenges: function(){
    return this.get('project.projectChallenges').then((pcs)=>{
      this.set('projectChallenges', pcs);
      this.set('projectChallenge', pcs.firstObject);
      //now is a good time to fetch the aggregates
      this.fetchAggregates();
    });
  },
  
  fetchAggregates: function(){
    let pc = this.get('projectChallenge');
    let { auth_token }  = this.get('session.data.authenticated');
    let endpoint = `${ENV.APP.API_HOST}/daily-aggregates/${pc.id}`;
    let comparisons = this.get('userComparisons');
    let comps=''
    if (comparisons) {
      for( var i =0; i < comparisons; i++) {
        let prefix = (i==0) ? "?" : "&";
        comps+=`${prefix}comparison[]=${comparisons[i]}`;
      }
    }
    return fetch((endpoint+comps), { 
      method: 'get',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then(() => {
    }).catch(() => {
      alert('Failed to get aggregates');
    });
     
  },
  _updateWhereIWrite: function(){
    //default to null
    this.set('whereIWrite', null);
    let sessions = this.get('challengeSessions');
    let whereObj = {0:0};
    //loop through the sessions
    sessions.forEach((s)=>{
      //is there a where?
      if(s.where) {
        if (whereObj[s.where]>0) {
          whereObj[s.where]+=s.count;
        }else{
          whereObj[s.where]=s.count;
        }
      }
    });
    //determine the key with the max value 
    let max = Object.keys(whereObj).reduce((a, b) => whereObj[a] > whereObj[b] ? a : b);
    if (max > 0) {
      //there is a max that is not 0, find the dang location name
      this.get('store').findRecord('writing-location', parseInt(max) ).then((loc)=>{
        this.set('whereIWrite', loc.name);
      });   
    }
  }
  
});
