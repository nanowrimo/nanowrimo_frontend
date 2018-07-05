import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';


const ProjectChallenge = Model.extend({
  startCount: attr('number'),
  currentCount: attr('number'),
  targetCount: attr('number'),
  goal: attr('number'),
  startsAt: attr('date'),
  endsAt: attr('date'),
  writingType: attr('number'),
  unitType: attr('number'),
  
  
  challenge: belongsTo('challenge'),
  project: belongsTo('project'),
  
  
  duration: computed("startsAt", "endsAt", function(){
    // return the difference between start and end in number of days
    let s = moment(this.get('startsAt'));
    let e = moment(this.get('endsAt'));
    let duration = moment.duration(e.diff(s));
    return duration.asDays();
  }),
  
});

export default ProjectChallenge;
