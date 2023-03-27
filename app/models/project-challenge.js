import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed, observer } from '@ember/object';
import moment from 'moment';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

const ProjectChallenge = Model.extend({
  currentUser: service(),
  store: service(),
  session: service(),
  
  user_id: attr('number'),
  project_id: attr('number'),
  challenge_id: attr('number'),
  startCount: attr('number'),
  currentCount: attr('number'),
  goal: attr('number'),
  startsAt: attr('string'),
  endsAt: attr('string'), 
  wonAt: attr('date'),
  writingType: attr('number'),
  unitType: attr('number'),
  eventType: attr('number'),
  //importable: attr('number'),
  name: attr('string'),
  //nanoEvent: attr('boolean'),

  //relationships
  challenge: belongsTo('challenge'),
  project: belongsTo('project'),
  user: belongsTo('user'),
  projectSessions: hasMany('projectSession'),
  // Awarded badges
  userBadges: hasMany('user-badge'),

  how: attr('number'),
  feeling: attr('number'),
  writingLocation: attr('string'),
  when: attr('number'),
  speed: attr('number'),
  streak: attr('number'),
  
  lastRecompute: attr('date'),

  // the daily aggregates will be updated when the projectChallenge's currentCount changes
  dailyAggregates: null,
  
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
  computedChallenge: computed('challenge.[]','challenge_id', function(){
    // get the store 
    let s = this.get('store');
    // get the id of the associated challenge 
    let cid = this.get('challenge_id');
    //is there an id to check?
    if (cid) {
      // get the challenge record with challenge id
      let challenge = s.peekRecord('challenge', cid);
      return challenge;  
    } else {
      return null;
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
  
  
  countObserver: observer('currentCount', function(){
    this.loadAggregates();
  }),
  
  countPerDay: computed('goal', 'duration', function(){
    let g = this.get('goal');
    let d = this.get('duration');
    return Math.round(g/d);
  }),
  
  fractionCountPerDay: computed('goal', 'duration', function(){
    let g = this.get('goal');
    let d = this.get('duration');
    return g/d;
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
  
  datesShortMonthDayYearFormat: computed("startsAt", "endsAt", function(){
    let start = this.get('startsAt');
    let end = this.get('endsAt');
    let s = moment.utc(start);
    let e = moment.utc(end).add(1,'d');
    let range = [];
    //loop while the s is not the same as e day
    while(! s.isSame(e, 'day')) {
      //add the start date to the range
      range.push( s.format("MMM D, YYYY"));
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
    } else {
      return "words";
    }
  }),
  unitTypeSingular: computed("unitType", function(){
    let type = this.get('unitType');
    if (type===0) {
      return "word";
    } else if (type===1) {
      return 'hour';
    } else {
      return "word";
    }
  }),
  
  // The total count, computed by adding the project challenges startCount and currentCount
  count: computed('startCount', 'currentCount', function(){
    // Get project sessions for this project_challenge
    let sc = this.get('startCount');
    let cc = this.get('currentCount');
    return (cc-sc);
  }),
  
  // Returns the total number of words needed to win
  countRemaining: computed('currentCount','goal', function(){
    // Compute remaining words
    let remaining = this.get('goal') - this.get('currentCount');
    // If less than zero, set to zero
    if (remaining < 0) {
      remaining = 0;
    }
    // Return the remaining count
    return remaining;
  }),
  
  // Returns the number of words written today, as defined by daily aggregates
  todayCount: computed('dailyAggregates.[]', function(){
    let count = 0;
    //get the daily aggregates
    let aggs = this.get('dailyAggregates');
    if (aggs) {
      let user = this.get('store').peekRecord('user', this.get('user_id'));
      let date = user.currentDateStringInTimeZone;
      //loop the aggs
      for (var i = 0; i< aggs.length; i++) {
        //get the indexed aggregate
        let todayAgg = aggs[i];
        if (todayAgg.day == date) {
          count = todayAgg.count;
          break;
        }
      }
    }
    return count;
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
    // return the difference rounded up 
    return Math.ceil(duration.asDays());
  },
  
  // Returns true if the challenge has started, otherwise false
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
  
  // Returns true if the challenge has ended, otherwise false
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
    if (nowString > end) {
      return true;
    } else {
      return false;
    }
  }),  
  
  // Returns true if the challenge is on-going, otherwise false
  isActive: computed('hasStarted', 'hasEnded', function() {
    // Find out if the challenge has started
    let hs = this.get('hasStarted');
    // Find out if the challenge has ended
    let he = this.get('hasEnded');
    // Return true is started but not ended, otherwise false
    return (hs && !he);
  }),
  
  loadAggregates: function() {
    // get the ID of self
    let id = this.get('id');
    // if there is no id, return 
    if (id==null) {
      return;
    }
     // fetch the daily aggregates that reference this project challenge
    let endpoint =  `${ENV.APP.API_HOST}/project-challenges/${this.get('id')}/daily-aggregates`;
    let { auth_token } = this.get('session.data.authenticated');
    //fetch the stats from the API
    fetch(endpoint, {
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then(resp=>{
      resp.json().then(json=>{
        // convert the JSON-API response to something more sane
        let aggs = [];
        json.data.forEach((agg)=>{
          aggs.pushObject(agg.attributes);
        });
        this.set('dailyAggregates', aggs);
      });
    });
  },
  
  winnerBadge: function(){ 
    let eType = this.get('eventType');
    //use the store
    let store = this.get('store');
    // get the badges 
    let badges = store.peekAll('badge');
    let winnerBadges = badges.filterBy("winner", true);
    let eventWinnerBadges = winnerBadges.filterBy("eventType", eType)
    if(eventWinnerBadges) {
      let winnerBadge = eventWinnerBadges[0];
      return winnerBadge;
    }
  }
  
});

export default ProjectChallenge;
