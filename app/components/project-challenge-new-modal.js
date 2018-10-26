import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  store: service(),
  projectChallenge:null,
  newDuration:null,
  displayStartsAt: null,

  optionsForWritingType: computed(function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
  }),


  init(){
    this._super(...arguments);
    //this._resetProjectChallenge();
  },

  actions: {

    onShow() {
      this._resetProjectChallenge();
    },
    onHidden() {
     
    },
    saveProjectChallenge() {
      //hide the modal
      this.set('open', false);
      //assign the project to the project challenge
      let pc = this.get('projectChallenge');
      pc.set('project', this.get('project'));
      pc.save();
    },
    writingTypeChanged(val) {
      this.set('projectChallenge.writingType', val);
    },
    unitTypeChanged(val) {
      this.set('projectChallenge.unitType', val);
    },
     durationChanged(val) {
      this.set('newDuration', val);
      this.recomputeEndsAt();
    },
    startsAtChanged(val) {
      //set the new StartsAt
      let m = moment.utc(val);
      this.set('newStartsAt', m);
      //set the project-challenge starts at
      this.set('projectChallenge.startsAt', m.toDate());
      this.recomputeEndsAt();
    }
  },
  
  _resetProjectChallenge(){
    let projectChallenge = this.get('store').createRecord('projectChallenge');
    this.set('projectChallenge', projectChallenge);
    projectChallenge.set('name',"My New Goal");
    projectChallenge.set('unitType',"0");
    projectChallenge.set('goal',50000);
    let now = moment();
    this.set('displayStartsAt', now.format("YYYY-MM-DD"));
    projectChallenge.set('startsAt', now.toDate()); 
    projectChallenge.set('endsAt', now.add(30,'d').toDate()); 
    this.set('newDuration', 30);
  }
});
