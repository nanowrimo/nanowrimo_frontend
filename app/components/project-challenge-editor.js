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
  displayEndsAt: null,
  displayWinAt: null,
  newDuration: null,
  newStartsAt: null,
  newWinAt: null,
  validChallengeDates: null,
  //startCount: 0,
  //currentCount: 0,
  //goal: 0,
  
  metGoal: computed('changeset.{startCount,currentCount,goal}', function() {
    let diff = this.get('changeset.currentCount') - this.get('changeset.startCount');
    if (this.get('changeset.goal') <= diff) {
      return true;
    }
    return false;
  }),
  
  optionsForWritingType: computed(function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
  }),
  disableName: computed(function() {
    let et = this.get('challenge.eventType')
    return  (et === 0 || et === 1);
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
  pastTense: computed('challenge',function() {
    let et = this.get('challenge.eventType')
    if (et === 0 || et === 1) {
      let d = new Date();
      let c = this.get('challenge');
      if (c.endsAt < d) {
        return true;
      }
    }
    return false;
  }),
  isConjugated: computed('pastTense',function() {
    if (this.get('pastTense')) {
      return "was";
    }
    return "is";
  }),
  doConjugated: computed('pastTense',function() {
    if (this.get('pastTense')) {
      return "did";
    }
    return "do";
  }),
  goalTypeLabel: computed('pastTense', function() {
    return "What type of goal " + this.get('isConjugated') + " this?"
  }),
  goalCountLabel: computed('pastTense', function() {
    return "What " + this.get('isConjugated') + " your goal?"
  }),
  startLabel: computed('pastTense', function() {
    if (this.get('pastTense')) {
      return "What was your start date?"
    } else {
      return "What's your start date?"
    }
  }),
  durationLabel: computed('pastTense', function() {
    if (this.get('pastTense')) {
      return "When was the last day of writing?"
      //return "How many days did you write for?"
    } else {
      return "When is the last day of writing?"
      //return "How many days do you want to write for?"
    }
  }),
  startCountLabel: computed('pastTense', function() {
    return "When " + this.get('doConjugated') + " you start?"
  }),
  
  winDateClass: computed('pastTense', function() {
    return "When " + this.get('doConjugated') + " you start?"
  }),
  steps: computed(function() {
    return [
      ['name','writingType', 'goal', 'unitType', 'startsAt', 'endsAt'],
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
    let newStartsAt = moment().utc();
    let newEndsAt = moment().add(30,'d');
    //get the time now
    let newWinAt = moment();
    //check for the challenge
    let challenge = this.get('challenge');
    if (challenge) {
      newStartsAt = moment.utc(challenge.startsAt);
      newEndsAt = moment.utc(challenge.endsAt);
      //clone the challenge data into the project challenge changeset
      this.set('changeset.name', challenge.name);
      this.set('changeset.goal', challenge.defaultGoal);
      this.set('changeset.endsAt', moment.utc(challenge.endsAt).toDate());
      this.set('changeset.winAt', moment.utc(challenge.endsAt).toDate());
      this.set('changeset.writingType', challenge.writingType);
      this.set('changeset.unitType', challenge.unitType);
      this.set('changeset.challenge', challenge);
      this.set('changeset.startCount', 0);
      this.set('changeset.currentCount', 0);
      this.set('changeset.startsAt', newStartsAt);
      this.set('changeset.endsAt', newEndsAt);
      
    } else {
      //set the name of the challenge
       this.set('changeset.name', 'My new goal');
      
      //set the goals to default to 50K
       this.set('changeset.goal', 50000);
       //set the unitType to 0 (words type)
       this.set('changeset.unitType', 0);
       this.set('changeset.startsAt', newStartsAt.toDate());
       this.set('changeset.endsAt', newEndsAt.toDate());
    }
    //format the newStartsAt and set the displayStartsAt
    this.set('displayStartsAt', newStartsAt.format("YYYY-MM-DD"));
    this.set('displayEndsAt', newEndsAt.format("YYYY-MM-DD"));
    this.set('newStartsAt', newStartsAt);
    this.set('newEndsAt', newEndsAt);
   
    this.set('displayWinAt', newWinAt.format("YYYY-MM-DD"));
    this.set('newWinAt', newWinAt);
     this.recomputeValidChallengeDates();
  },
  
  recomputeValidChallengeDates: function(){
    let e = moment(this.get('newEndsAt'));
    let s = moment(this.get('newStartsAt'));
    let valid = s.isSameOrBefore(e,'d');
    this.set('validChallengeDates', valid);
  },
  
  endsBeforeStarts: computed('newEndsAt', 'newStartsAt', function(){
    let e = moment(this.get('newEndsAt'));
    let s = moment(this.get('newStartsAt'));
    return e.isBefore(s, 'd');
  }),
  
  actions: {
    durationChanged(val) {
      this.set('newDuration', val);
      this.recomputeEndsAt();
    },
    endsAtChanged(val) {
      //let m = moment.utc(val);
      //this.set('newEndsAt', m);
      //this.set('changeset.endsAt', m.toDate());
      this.set('newEndsAt', val);
      this.set('changeset.endsAt', val);
      this.recomputeValidChallengeDates();

    },
    startsAtChanged(val) {
      //alert(val);
      //set the new StartsAt
      //let m = moment.utc(val);
      //this.set('newStartsAt', m);
      this.set('newStartsAt', val);
      //set the project-challenge starts at
      //this.set('changeset.startsAt', m.toDate());
      this.set('changeset.startsAt', val);
      this.recomputeValidChallengeDates();
    }
  }
  
});
