import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import moment from 'moment';
import { next } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  session: service(),
  store: service(),
  statsParams: service(),
  
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
  countNeededTodayData: computed('count', function() {
    let pc = this.get('projectChallenge');
    if (pc) {
      if (pc.hasEnded()) {
        return {'needed':0,"percent":0};
      }
      
      //countRemaining
      let countRemaining = this.get('projectChallenge.countRemaining');
      //daysRemaining
      let daysRemaining = this.get('projectChallenge').daysRemaining();
      //countToday
      let todayCount = this.get('projectChallenge.todayCount');
      //countPerDayToFinishOnTime = countRemaining+countToday/daysRemaining
      let countPerDay = parseInt((countRemaining+todayCount) / daysRemaining);
      //needed = countPerDayToFinishOnTime - countToday
      let needed = countPerDay - todayCount;
      //percent = needed*100/countPerDayToFinishOnTime
      let percent = Math.round(todayCount*100/countPerDay);

      if (needed>0){
        return {'needed':needed,"percent":percent};
      }else{
        return {'needed':0,"percent":100};
      }
    }
  }),
  writingSpeed: computed('challengeSessions.[]',function() {
    let sessions = this.get('challengeSessions');
    if (sessions) {
      let minutes = 0;
      let count = 0;
      
      //loop through the sessions
      sessions.forEach((s)=>{
        //is there a start and end?
        if(s.start && s.end) {
          let start = moment(s.start);
          let end = moment(s.end);
          //get the difference in minutes
          minutes += end.diff(start,'minutes');
          count+= s.count;
        }
      });
      if (minutes && count) {
        return parseInt(count/minutes);
      } else {
        return 0;
      }
    }
  }),
  
  averageFeeling: computed('challengeSessions.[]',function() {
    let sessions = this.get('challengeSessions');
    if (sessions) {
      let feelings = {};
      //loop through the sessions
      sessions.forEach((s)=>{
        if (s.feeling) {
          
          if ( feelings[s.feeling])
          {
            feelings[s.feeling]+=1;
          } else {
            feelings[s.feeling]=1;
          }
        }
      });
      let key = this._objectKeyWithHighestValue(feelings);
      return parseInt(key);
    }
  }),
  // determine which hours of the day the user is writing during 
  userHourAggregates: computed('challengeSessions.[]',function() {
    //get the sessions
    let hoursObject = Array(24);
    hoursObject.fill(0);
    let sessions = this.get('challengeSessions');
    if(sessions) {
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
    }
  }),
  
  // determine if there is data in the userHourAggregates
  hasHourAggregates: computed('userHourAggregates.[]', function(){
    let aggs = this.get('userHourAggregates');
    let retval = false;
    //loop!
    if (aggs) {
      for (var i=0; i < aggs.length; i++) {
        if(aggs[i] > 0) {
          retval = true;
          break;
        }
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
  
  count: computed('challengeSessions.[]','project.projectSessions.[]', function() {
    let sessions = this.get('challengeSessions');
    let sum = 0;
    if (sessions) {
      sessions.forEach((s)=>{ sum+= s.count});
    }
    return sum;
  }),
  projectedFinishDate: computed('challengeSessions.[]', function() {
    //  today's date + (goal remaining / average per day) days  
    let date = moment();
    let remainingCount = this.get('goal') - this.get('count');
    let daysToGo = remainingCount/this.get('dailyAverage');
    date.add(daysToGo, 'd');
    return date.format("MMMM D");
  }),
  //
  todaysSessions: computed('challengeSessions.[]', function() {
    let css = this.get('challengeSessions');
    if (css) {
      let todays = [];
      let now = moment();
      css.forEach((cs)=>{
        if (moment(cs.createdAt).isSame(now, 'day') ) {
          todays.push(cs);
        }
      });
      return todays;
    }
  }),
  
  todaysCount: computed('todaysSessions.[]', function() {
    let sum = 0;
    let ts = this.get('todaysSessions');
    if (ts) {
      ts.forEach((s)=>{
        sum+=s.count;
      });
      return sum;
    }
  }),
  
  challengeSessions: computed('project','projectChallenge','project.projectSessions.[]', function() {
    let cStart = moment( this.get('projectChallenge.startsAt') );
    let cEnd = moment( this.get('projectChallenge.endsAt') ).add(1,'d');
    let pc = this.get('projectChallenge.nanoEvent');
    // Get the currentUser's timezone
    let tz = this.get('currentUser.user.timeZone');
    // If this is a nano event, calculate from the beginning of the day
    if (pc) {
      // Figure out when the event should start in the user's timezone
      let newStart = cStart.utc().format("YYYY-MM-DD");
      var m = moment.tz(newStart, "YYYY-MM-DD", tz);
      var start = m.clone().startOf('day').utc();
      cStart = start;
      let newEnd = cEnd.utc().format("YYYY-MM-DD");
      var m = moment.tz(newEnd, "YYYY-MM-DD", tz);
      var end = m.clone().startOf('day').utc();
      cEnd = end;
      //alert(start);
    }
    let p = this.get('project');
    if (p) {
      //get the projectSessions created during the projectChallenge
      let sessions = this.get('project.projectSessions');
      let newSessions = [];
      sessions.forEach((s)=>{
        let sCreated = moment(s.createdAt).utc();
        if (s.end) {
          sCreated = moment(s.end).utc();
        }
        //alert(sCreated);
        if(cStart.isBefore(sCreated) && sCreated.isBefore(cEnd) ){
          //alert('included');
          newSessions.push(s);
        }
      });
      return newSessions;
    }
  }),

  init(){
    this._super(...arguments);
    // are there statsParams?
    let sp = this.get('statsParams');
    //does the statsParams service have data?
    if (sp.hasData() ) {
      let p = sp.getProject();
      this.set('project', p);
      this.set('projectChallenges', p.projectChallenges );
      this.set('projectChallenge', sp.getProjectChallenge() );
      //clear the statsParams data
      sp.clear();
    } else {
      let p = this.get('currentUser.user.primaryProject');
      if (p) {
        this.set('project', p);
        this.set('projectChallenges', p.projectChallenges );
        this.set('projectChallenge', p.currentProjectChallenge );
      } else {
        //the user has no projects :/
      }
    }
    // if there is no projectChallenge, there are no stats to display
    if (this.get('projectChallenge') ) {
      //fetch the aggregates
      this.fetchAggregates();
    }
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
          this._changeProjectChallenge(p.currentProjectChallenge);
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
          this._changeProjectChallenge(pc);
          //this.set('projectChallenge', pc);
          break;
        }
      }
    }
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
    if(sessions) {
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
      let max = this._objectKeyWithHighestValue(whereObj);
      if (max > 0) {
        //there is a max that is not 0, find the dang location name
        this.get('store').findRecord('writing-location', parseInt(max) ).then((loc)=>{
          this.set('whereIWrite', loc.name);
        });   
      }
    }
  },
  
  _objectKeyWithHighestValue: function(object) {
    if (Object.keys(object).length > 0) {
      return Object.keys(object).reduce((a, b) => object[a] > object[b] ? a : b);
    } else {
      return null;
    }
  },
  //change the projectChallenge with a slight delay
  _changeProjectChallenge: function(newPC) {
    //set the pc to null -- this will hide charts that depends upon projectChallenge
    this.set('projectChallenge', null);
    //wait a bit and set the pc to the proper value
    next(()=>{
      this.set('projectChallenge', newPC);
    });
  }
});
