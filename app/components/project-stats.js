import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),
  session: service(),
  
  project: null,
  projectChallenge: null,
  projectChallenges: null,
  
  userUnitsToday: computed('projectChallenge','project.projectSessions.[]', function() {
    var data = {
      name: this.get('currentUser.user.name'),
      countToday: this.get('todaysCount'),
      countPerDay: this.get('projectChallenge.countPerDay')
    };
    return data;
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
  //loop the sessions 
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
     
  }
  
});
