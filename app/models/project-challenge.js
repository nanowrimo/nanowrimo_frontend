import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';

const ProjectChallenge = Model.extend({
  startCount: attr('number'),
  currentCount: attr('number'),
  goal: attr('number'),
  startsAt: attr('date'),
  endsAt: attr('date'),
  writingType: attr('number'),
  unitType: attr('number'),
  name: attr('string'),
  
  challenge: belongsTo('challenge'),
  project: belongsTo('project'),
  user: belongsTo('user'),
  projectSessions: hasMany('projectSession'),
  
  // Awarded badges
  userBadges: hasMany('user-badge'),
  
  countPerDay: computed('goal', 'duration', function(){
    let g = this.get('goal');
    let d = this.get('duration');
    return Math.round(g/d);
  }),
  duration: computed("startsAt", "endsAt", function(){
    // return the difference between start and end in number of days
    let s = moment(this.get('startsAt'));
    let e = moment(this.get('endsAt'));
    let duration = moment.duration(e.diff(s));
    return Math.round(duration.asDays());
  }),
  dates: computed("startsAt", "endsAt", function(){
    let s = moment.utc(this.get('startsAt'));
    let e = moment.utc(this.get('endsAt'));
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
    let e = moment.utc(end);
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
  count: computed('projectSessions.[]', function(){
    let pss = this.get('projectSessions');
    let sum = 0;
    pss.forEach((ps)=> {sum+=ps.count });
    return sum;
  }),
  
  numElapsedDays: function(){
    // return the difference between start and end in number of days
    let s = moment(this.get('startsAt'));
    let now = moment();
    let duration = moment.duration(now.diff(s));
    return Math.round(duration.asDays());
  }
});

export default ProjectChallenge;
