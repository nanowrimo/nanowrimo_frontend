import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from '@ember/service';

const ProjectChallenge = Model.extend({
  currentUser: service(),
  store: service(),
  user_id: attr('number'),
  project_id: attr('number'),
  challenge_id: attr('number'),
  startCount: attr('number'),
  currentCount: attr('number'),
  goal: attr('number'),
  startsAt: attr('string'),
  endsAt: attr('string'),
  writingType: attr('number'),
  unitType: attr('number'),
  //importable: attr('number'),
  name: attr('string'),
  //nanoEvent: attr('boolean'),
  latestCount: attr('number'), // the lastest count according to the API server 
  //relationships
  challenge: belongsTo('challenge'),
  project: belongsTo('project'),
  user: belongsTo('user'),
  projectSessions: hasMany('projectSession'),
  // Awarded badges
  userBadges: hasMany('user-badge'),
  // stats!
  where: attr('number'), //where the user is writing
  how: attr('number'), //how the user was writing
  feeling: attr('number'), //how the user was feeling while writing
  speed: attr('number'), // the user's writing speed in words per minute
  streak: attr('number'), // how many days in a row the user updated for this goal
  
  // ---------------------------
  // BEGINNING OF RELATIONSHIP FUNCTIONS
  // ---------------------------

  // Finding project without needing relationships
  computedProject: computed('project_id',function() {
    let pid = this.get('project_id');
    let store = this.get('store');
    let project = store.peekRecord('project', pid);
    return project;
  }),
  
  // Finding user without needing relationships
  computedUser: computed('computedProject',function() {
    let project = this.get('computedProject');
    let store = this.get('store');
    let user = store.peekRecord('user', project.user_id);
    return user;
  }),
  
   // get the challenge without an api call with a relationship
  computedChallenge: computed('challenge_id', function(){
    // get the store 
    let s = this.get('store');
    // get the id of the associated challenge 
    let cid = this.get('challenge_id');
    //is there an id to check?
    if (cid) {
      // get the challenge record with challenge id
      let challenge = s.peekRecord('challenge', cid);
      return challenge;  
    }
  }),
  
  // ---------------------------
  // END OF RELATIONSHIP FUNCTIONS
  // ---------------------------
  
  // ---------------------------
  // BEGINNING OF DATETIME FUNCTIONS
  // ---------------------------
  
  // Returns a date string of the start date
  startDateString: computed('startsAt',function() {
    // Get the startsAt value
    let startsAt = this.get('startsAt');
    // First create a moment from the startsAt datetime
    let utcTime = moment.utc(startsAt);
    // Create the date string
    let startDate = utcTime.format('YYYY-MM-DD');
    // Return the date string
    return startDate;
  }),
  
  // Returns a date string of the end date
  endDateString: computed('endsAt',function() {
    // Get the endAt value
    let endsAt = this.get('endsAt');
    // First create a moment from the endsAt datetime
    let utcTime = moment.utc(endsAt);
    // Create the date string
    let endDate = utcTime.format('YYYY-MM-DD');
    // Return the date string
    return endDate;
  }),
  
  // ---------------------------
  // END OF DATETIME FUNCTIONS
  // ---------------------------
  
  countPerDay: computed('goal', 'duration', function(){
    let g = this.get('goal');
    let d = this.get('duration');
    return Math.round(g/d);
  }),

  duration: computed("startsAt", "endsAt", function(){
    // return the difference between start and end in number of days
    let s = moment(this.get('startsAt'));
    let e = moment(this.get('endsAt')).add(1,'d');
    let duration = moment.duration(e.diff(s));
    return Math.round(duration.asDays());
  }),
  
  dates: computed("startsAt", "endsAt", function(){
    let s = moment.utc(this.get('startsAt'));
    let e = moment.utc(this.get('endsAt')).add(1,'d');
    let range = [];
    //loop while the s is not the same as e day
    while(! s.isSame(e, 'day')) {
      //add the start date to the range
      range.push( s.format("YYYY-MM-DD"));
      //add 1 day to the s
      s.add(1,'d');
    }
    return range;
  }),
  
  datesShortMonthDayFormat: computed("startsAt", "endsAt", function(){
    let start = this.get('startsAt');
    let end = this.get('endsAt');
    let s = moment.utc(start);
    let e = moment.utc(end).add(1,'d');
    let range = [];
    //loop while the s is not the same as e day
    while(! s.isSame(e, 'day')) {
      //add the start date to the range
      range.push( s.format("MMM D"));
      //add 1 day to the s
      s.add(1,'d');
    }
    return range;
  }),
  
  unitTypePlural: computed("unitType", function(){
    let type = this.get('unitType');
    if (type===0) {
      return "words";
    } else if (type===1) {
      return 'hours';
    }
  }),
  unitTypeSingular: computed("unitType", function(){
    let type = this.get('unitType');
    if (type===0) {
      return "word";
    } else if (type===1) {
      return 'hour';
    }
  }),
  
  // The total count, computed from the project sessions
  count: computed('projectSessions.@each.count', function(){
    // Get project sessions for this project_challenge
    let pss = this.get('projectSessions');
    // Set the sum of the project sessions to zero
    let sum = 0;
    // For each project_session add to the sum
    pss.forEach((ps)=> {sum+=ps.count });
    //get the latest count according to the API server
    //let lc = this.get('latestCount');
    //return (sum>lc) ? sum : lc ;
    return sum;
  }),
  
  // Returns the total number of words needed to win
  countRemaining: computed('count', function(){
    // Compute remaining words
    let remaining = this.get('goal') - this.get('count');
    // If less than zero, set to zero
    if (remaining < 0) {
      remaining = 0;
    }
    // Return the remaining count
    return remaining;
  }),
  
  // Returns the number of words written today, as defined by the user's time zone
  todayCount: computed('projectSessions.[]', function(){
    // Get the project user
    let user = this.get('computedUser');
    // Get the current date string in the user's time zone
    let userDate = user.currentDateStringInTimeZone;
    // Get project sessions for this project_challenge
    let pss = this.get('projectSessions');
    // Set the sum of today's project sessions to zero
    let sum = 0;
    // For each project_session...
    pss.forEach((ps)=> {
      // Get the date it belongs to
      let psDate = user.dateStringInTimeZone(ps.createdAt);
      // If the ps date is today...
      if (userDate==psDate) {
        // ...add to the sum
        sum+=ps.count; 
      }
    });
    // Return the sum
    return sum;
  }),
  
  metGoal: computed('goal', 'count', function(){
    let g = this.get('goal');
    let c = this.get('count');
    return c>=g;
  }),
  
  // Returns the difference between now in the user's timezone and the end date
  daysRemaining: function() {
    // Get the project user
    let user = this.get('computedUser');
    // Get the current date string in the user's time zone
    let userDate = user.currentDateStringInTimeZone;
    // Get the start date string
    let startDate = this.get('startDateString');
    // Get the end date string
    let endDate = this.get('endDateString');
    // If the user date is before the start date, set it to the start date
    if (userDate<startDate) userDate = startDate;
    // Set duration to 0
    let duration = 0;
    // If the user date is before the end date, there is a positive duration
    if (userDate<=endDate) {
      // Set the start date in moment
      let sDate = moment(userDate);
      // Set the end date in moment and add one for counting purposes
      let eDate = moment(endDate).add(1,'d');
      // Calculate the duration from the difference
      duration = Math.ceil(eDate.diff(sDate,'days'));
    }
    // return the duration
    return duration;
  },
  
  numElapsedDays: function(){
    // return the difference between start and now in number of days
    let s = moment(this.get('startsAt'));
    let e = moment(this.get('endsAt')).add(1,'d');
    let now = moment();
    let duration;
    if (now.isSameOrAfter(e,'d') ) {
      duration = moment.duration(e.diff(s));
    } else {
      duration = moment.duration(now.diff(s));
    }
    return Math.round(duration.asDays());
  },
  
  hasEnded: computed('endsAt', function() {
     // get the user 
    let tz = this.get('currentUser.user.timeZone');
    //when is now in the user's tz?
    let now = moment().tz(tz);
    //get just the Date  of now in the user's tz
    let nowString = now.format("YYYY-MM-DD");
    // get the 'end' of the challenge
    let end = this.get('endsAt');
    // is now after or equal to the end?
    if (nowString >= end || end==null) {
      return true;
    } else {
      return false;
    }
  }),  
  
  hasStarted: computed('startsAt', function() {
    // get the user 
    let tz = this.get('currentUser.user.timeZone');
    //when is now in the user's tz?
    let now = moment().tz(tz);
    //get just the Date  of now in the user's tz
    let nowString = now.format("YYYY-MM-DD");
    // get the 'start' of the challenge
    let start = this.get('startsAt');
    // is now after or equal to the start?
    if (nowString >= start) {
      return true;
    } else {
      return false;
    }
  }),
  
});

export default ProjectChallenge;
