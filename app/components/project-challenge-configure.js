import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  store: service(),

  tagName: '',
  challenge: null,
  displayStartsAt: null,
  displayWinAt: null,
  
  newDuration: null,
  newStartsAt: null,
  newWinAt: null,
  
  //startCount: 0,
  //currentCount: 0,
  //goal: 0,
  
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
      //TODO: user moment for date comparison
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
      return "How many days did you write for?"
    } else {
      return "How many days do you want to write for?"
    }
  }),
  startCountLabel: computed('pastTense', function() {
    return "When " + this.get('doConjugated') + " you start?"
  }),
  
  winDateClass: computed('pastTense', function() {
    return "When " + this.get('doConjugated') + " you start?"
  }),
 
  init() {
    this._super(...arguments);
    let projectChallenge = this.get('projectChallenge');
    let newStartsAt = moment(projectChallenge.startsAt);
    this.set('displayStartsAt', newStartsAt.format("YYYY-MM-DD"));
    this.set('newStartsAt', newStartsAt);
    this.set('newDuration', projectChallenge.duration);
  },
  
  recomputeEndsAt: function() {
    let start = moment.utc( this.get('newStartsAt') );
    let duration = this.get('newDuration');
    let newEndsAt = start.add(duration, 'days');
    this.set('projectChallenge.endsAt', newEndsAt.toDate());
  },
  
  actions: {
   
  }
  
});
