import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';

const Challenge = Model.extend({
  defaultGoal: attr('number'),
  prepStartsAt: attr('string'),
  startsAt: attr('string'),
  endsAt: attr('string'),
  winAllowedAt: attr('string'),
  eventType: attr('number'),
  userId: attr('number'),
  //eventType is defined in the api as:
  // 0 = NaNoWriMo
  // 1 = Camp
  // 2 = User Created
  
  writingType: attr('number'),
   //writingType is defined in the api as:
  // 0 = novel
  // 1 = revision
  
  flexibleGoal: attr('boolean'),
  unitType: attr('number'),
  //unitType is defined in the api as:
  // 0 = words
  // 1 = hours
  
  user: belongsTo('user'),
  projects: hasMany('project'),
  
  // Used here but not on API side
  name: attr('string'),
  
  isNaNoOrCampEvent: computed('eventType', function(){
    let type = this.get('eventType');
    return (type === 0 || type === 1 );
  }),
  
  duration: computed("startsAt", "endsAt", function(){
    // return the difference between start and end in number of days
    let s = moment(this.get('startsAt'));
    let e = moment(this.get('endsAt')).add(1,'d');
    let duration = moment.duration(e.diff(s));
    return duration.asDays();
  }),
  unitTypeAsString: computed('unitType', function(){
    let ut = this.get('unitType');
    if (ut) {
      return ut.toString();
    }
  }),
  writingTypeAsString: computed('writingType', function(){
    let wt = this.get('writingType');
    return wt.toString();
  }),
  
  // Returns true if the challenge has already started
  hasStarted: computed("startsAt", function() {
    let s = moment(this.get('startsAt')).format("YYYY-MM-DD");
    let now = moment().format("YYYY-MM-DD");
    // If the challenge has started
    if (now>=s) {
      return true;
    } else {
      return false;
    }
  }),
  
});

Challenge.reopenClass({
  optionsForWritingType: [
    {value:'0', name: 'Writing'},
    {value:'1', name: 'Editing'}
  ],
  optionsForUnitType: [
   {value:'0', name: 'words'},
   // {value:'1', name: 'hours'}
  ]
});

export default Challenge;
