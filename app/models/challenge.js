import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';

const Challenge = Model.extend({
  defaultGoal: attr('number'),
  endsAt: attr('date'),
  startsAt: attr('date'),
  eventType: attr('number'),
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
  
  projects: hasMany('project'),
  
  name: computed('eventType', function(){
    let type = this.get('eventType');
    let name = ''
    switch(type) {
      case 0:
        name="NaNoWriMo";
        break;
      case 1:
        name="Camp NaNoWriMo";
        break;
      case 2:
        name="User Defined";
        break;
    }
    return name;
  }),
  
  isNaNoEvent: computed('eventType', function(){
    let type = this.get('eventType');
    return (type === 0 || type === 1 );
  }),
  
  duration: computed("startsAt", "endsAt", function(){
    // return the difference between start and end in number of days
    let s = moment(this.get('startsAt'));
    let e = moment(this.get('endsAt'));
    let duration = moment.duration(e.diff(s));
    return duration.asDays();
  }),
  
});

Challenge.reopenClass({
  optionsForWritingType: [
    {value:'0', name: 'Writing'},
    {value:'1', name: 'Editing'}
  ],
  optionsForUnitType: [
   {value:'0', name: 'words'},
    {value:'1', name: 'hours'}
  ]
});

export default Challenge;
