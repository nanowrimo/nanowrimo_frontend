import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
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
  
  
  // observe the projectChallenge
  projectChallengeObserver: observer('projectChallenge', function(){
    let pc = this.get('projectChallenge');
    if (pc) {
      pc.loadAggregates();
    }
  }),
  
  userUnitsToday: computed('projectChallenge', function() {
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
  
  userDailyAggregates: computed('challengeDailyAggregates.[]', function() {
    let das = this.get('challengeDailyAggregates');
    let dates = this.get('projectChallenge.dates');
    let aggs = {};
    if(dates) {
      let today = moment().format("YYYY-MM-DD");
      let todayFound = false;
      //create an aggregates array
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
      das.forEach((da)=>{
        var k = da.day;
        aggs[k]+=da.count;
      });
    }
    return aggs;
  }),
  
  countNeededTodayData: computed('count','projectChallenge.{countRemaining,daysRemaining,todayCount}', function() {
    let pc = this.get('projectChallenge');
    if (pc) {
      if (pc.hasEnded) {
        return {'needed':0,"percent":0};
      }
      //countRemaining
      let countRemaining = this.get('projectChallenge.countRemaining');
      //daysRemaining
      let daysRemaining = this.get('projectChallenge').daysRemaining();
      //countToday
      let todayCount = this.get('projectChallenge.todayCount');
      let countPerDay = Math.round((countRemaining+todayCount) / daysRemaining);
      //needed = countPerDayToFinishOnTime - countToday
      let needed = countPerDay - todayCount;
      //percent = needed*100/countPerDayToFinishOnTime
      let percent = Math.round(todayCount*100/countPerDay);
      if (needed>0){
        return {'needed':needed,"percent":percent};
      }else{
        return {'needed':0,"percent":100};
      }
    } else {
      return {'needed':0,"percent":0};
    }
  }),

  writingSpeed: computed('projectChallenge.speed',function() {
    let s = this.get('projectChallenge.speed');
    if (s===null) {
      s = 0;
    }
    return s;
  }),
  

  averageFeeling: computed('projectChallenge.feeling',function() {
    let f = this.get('projectChallenge.feeling');
    return f;
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
    }
    return hoursObject;
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

<<<<<<< HEAD
  dailyAverage: computed('userDailyAggregates.[]', function(){
    let aggs = this.get('userDailyAggregates');
    let average = 0;
=======
  dailyAverage: computed('projectChallenge.dailyAggregates.[]', function(){
    let aggs = this.get('projectChallenge.dailyAggregates');
>>>>>>> a963ec674d3bc7bfcbd6af6c7fdcbc03d117b720
    if (aggs) {
      let values = aggs.mapBy('count');
      let sum = 0;
      for (var i=0 ; i < values.length ; i++) {
        let val = values[i];
        if(val==null) {
          break;
        }
        sum+=val;
      }
      average = parseInt(sum/i)
    }
    return average;
  }),
  
  userPercentData: computed('projectChallenge.currentCount', function() {
    //create the data thingy for the current user 
    let currentCount = this.get('projectChallenge.currentCount');
    let goal = this.get('goal');
    let percent = (currentCount*100/goal);
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
  

  count: computed('projectChallenge.currentCount', function() {
    return this.get('projectChallenge.currentCount');
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
    let todays = [];
    if (css) {
      let now = moment();
      css.forEach((cs)=>{
        if (moment(cs.createdAt).isSame(now, 'day') ) {
          todays.push(cs);
        }
      });
    }
    return todays;
  }),
  
  todaysCount: computed('challengeDailyAggregates.[]', function() {
    let count = 0;
    let das = this.get('challengeDailyAggregates');
    let now = moment();
    das.forEach((da)=>{
      if (moment(da.day).isSame(now, 'day') ) {
        count = da.count;
      }
    });
    return count;
  }),
  
  challengeDailyAggregates: computed('project','projectChallenge','project.computedDailyAggregates.[]', function() {
    let cStart = this.get('projectChallenge.startsAt');
    let cEnd = this.get('projectChallenge.endsAt');
    let p = this.get('project');
    let newdas = [];
    if (p) {
      //get the dailyAggregates created during the projectChallenge
      let das = this.get('project.computedDailyAggregates');
      das.forEach((da)=>{
        if(cStart<=da.day && cEnd>=da.day ){
          newdas.push(da);
        }
      });
    }
    return newdas;
  }),

  // get all sessions in the store when this projectChallenges sessions array changes
  sessions: computed('projectChallenge.projectSessions.[]', function() {
    let s = this.get('store');
    let sessions = s.peekAll('projectSession');
    return sessions;
  }),
  
  // filter the sessions that are specific to this project Challenge
  projectChallengeSessions: computed('projectChallenge', 'sessions.[]', function() {
    let pc = this.get('projectChallenge');
    if (pc) {
      //peek the sessions associated with the projectChallenge
      let sessions = this.get('sessions').filterBy('project_challenge_id', parseInt(pc.id));
      return sessions;
    } else {
      return [];
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
    // is there a project challenge?
    let pc = this.get('projectChallenge')
    if (pc){
      // it should load it's aggregates
      pc.loadAggregates();
    }
  },

  actions: {
    projectSelectChanged: function(v) {
      let projects = this.get('currentUser.user.persistedProjects'); 
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
