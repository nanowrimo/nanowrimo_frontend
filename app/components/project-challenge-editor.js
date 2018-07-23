import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  store: service(),

  tagName: '',
  challenge: null,
  projectChallenge: null,
  changeset: null,
  project: null,
  saveAfterSave: null,
  displayStartsAt: null,
  newDuration: null,
  newStartsAt: null,
  
  
  optionsForWritingType: computed(function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
  }),
  
  disableWritingType: computed(function() {
    return this.get('challenge.eventType') === 0;
  }),
  disableDefaultGoal: computed(function() {
    return this.get('challenge.eventType') === 0;
  }),
  disableUnitType: computed(function() {
    return this.get('challenge.eventType') === 0;
  }),
  disableStartEnd: computed(function() {
    let et = this.get('challenge.eventType')
    return  (et === 0 || et === 1);
  }),

  steps: computed(function() {
    return [
      ['writingType', 'goal', 'unitType', 'startsAt', 'endsAt'],
    ]
  }),

  init() {
    this._super(...arguments);
    let projectChallenge = this.get('projectChallenge');
    let project = this.get('project');
    if (!projectChallenge) {
      projectChallenge = this.get('store').createRecord('projectChallenge');
      this.set('projectChallenge', projectChallenge);
      projectChallenge.set('project', project);
    }
    
    //get the time now
    let newStartsAt = moment();
    //check for the challenge
    let challenge = this.get('challenge');
    if (challenge) {
      newStartsAt = moment.utc(challenge.startsAt);
      //clone the challenge data into the project challenge changeset
      this.set('changeset.goal', challenge.defaultGoal);
      this.set('changeset.endsAt', moment.utc(challenge.endsAt).toDate());
      this.set('changeset.writingType', challenge.writingType);
      this.set('changeset.unitType', challenge.unitType);
      this.set('changeset.challenge', challenge);
    } else {
      //set the goals to default to 50K
       this.set('changeset.goal', 50000);
       //set the unitType to 0 (words type)
       this.set('changeset.unitType', 0);
    }
    //format the newStartsAt and set the displayStartsAt
    this.set('displayStartsAt', newStartsAt.format("YYYY-MM-DD"));
    this.set('newStartsAt', newStartsAt);
    this.set('changeset.startsAt', newStartsAt.toDate());
    this.set('newDuration', 30);
    //initial compute of endsat 
    this.recomputeEndsAt();
  },
  
  actions: {
    durationChanged(val) {
      this.set('newDuration', val);
      this.recomputeEndsAt();
    },
    startsAtChanged(val) {
      //set the new StartsAt
      let m = moment.utc(val);
      this.set('newStartsAt', m);
      //set the project-challenge starts at
      this.set('changeset.startsAt', m.toDate());
      this.recomputeEndsAt();
    }
  },
  
  recomputeEndsAt: function() {
    let start = moment.utc( this.get('newStartsAt') );
    let duration = this.get('newDuration');
    let newEndsAt = start.add(duration, 'days');
    this.set('changeset.endsAt', newEndsAt.toDate());
  }
});
