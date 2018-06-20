import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';

const Challenge = Model.extend({
  defaultGoal: attr('number'),
  endsAt: attr('date'),
  eventType: attr('number'),
  //eventType is defined in the api as:
  // 0 = NaNoWriMo
  // 1 = Camp
  // 2 = User Created
  flexibleGoal: attr('boolean'),
  startsAt: attr('date'),
  unitType: attr('string'),

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
  })
  
});

Challenge.reopenClass({
  optionsForWritingType: [
    'Writing',
    'Editing'
  ],
  optionsForUnitType: [
    'words',
    'hours'
  ]
});

export default Challenge;
