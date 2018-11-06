import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  store: service(),
  newDuration:null,
  displayStartsAt: null,
  validationErrors: null,
  editing: false,
  newStartsAt: null,
  newEndsAt:null,
  
  canEditName: computed('projectChallenge', function(){
    let pcu = this.get('projectChallenge.user');
    let pccu = this.get('projectChallenge.challenge.user');
    return pcu === pccu;
  }),
  
  disableName: computed('canEditName', function(){
    return !this.get('canEditName');
  }),
  
  projectChallengeIsValid: computed('validationErrors', function(){
    let ve = this.get('validationErrors');
    if(ve) {
      let hasError = (ve.startOverlap || ve.endOverlap || ve.fullOverlap);
      return !hasError;
    } else {
      return false;
    }
  }),
  
  optionsForWritingType: computed(function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
  }),


  init(){
    this._super(...arguments);
    //get the projectChallenge
    let pc = this.get('projectChallenge');
    //we are editing if the projectChallenge has been persisted and has an id
    if (pc && pc.id ){ 
      this.set('editting', true);
      this.set('newDuration', pc.duration);      
    }
  },

  actions: {
    goalChange(v) {
      this.set("projectChallenge.goal", v);
    },
    onShow() {
      if( this.get('editting') ){
        let pc = this.get('projectChallenge');
        this.set('displayStartsAt', moment(pc.startsAt).format("YYYY-MM-DD"));
       
      } else {
        this._resetProjectChallenge();
      }
    },
    onHidden() {
      this.set('open', false);
    },
    saveProjectChallenge() {
      //TODO: validate no time overlap with other projects
      this._validate();
      if (this.get('projectChallengeIsValid') ){
        //hide the modal
        this.set('open', false);
        //assign the project to the project challenge
        let pc = this.get('projectChallenge');
        pc.set('project', this.get('project'));
        //set the project-challenge starts at
        pc.set('startsAt', moment(this.get('newStartsAt')).toDate() );
        pc.set('endsAt', moment(this.get('newEndsAt')).toDate() );
        pc.save();
      }
    },
    closeModal() {
       this.set('open', false);
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
      this._validate();
    },
    startsAtChanged(val) {
      //set the new StartsAt
      let m = moment.utc(val);
      this.set('newStartsAt', m);
      this.recomputeEndsAt();
      this._validate();
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
    this.set('newStartsAt', now.toDate());
    projectChallenge.set('endsAt', now.add(30,'d').toDate()); 
    this.set('newEndsAt', now.toDate());
    this.set('newDuration', 30);
  },
  
   recomputeEndsAt: function() {
    let start = moment.utc( this.get('newStartsAt') );
    let duration = this.get('newDuration');
    let newEndsAt = start.add(duration, 'days');
    this.set('newEndsAt', newEndsAt.toDate());
  },
  
  _validate(){
    //get the current projectChallenge
    let currentpc = this.get('projectChallenge');
    let errors = {"startOverlap":false, "endOverlap": false, "fullOverlap":false, "badEnd":false, "badStart":false };
    //get the proposed start and end as moments
    let startTime = moment(this.get('newStartsAt'));
    let endTime = moment(this.get('newEndsAt'));
    //loop through this project's projectChallenges
    let pcs = this.get('project.projectChallenges');
    
    pcs.forEach((pc)=>{
      //don't validate against self
      if (pc !== currentpc) {
        let pcStart = moment(pc.startsAt);
        let pcEnd = moment(pc.endsAt);
        //check for a start overlap
        if (startTime.isBefore(pcEnd) && startTime.isAfter(pcStart) ) {
          errors.startOverlap = true;
          errors.badStart=true;
        }
        //check for an end overlap
        if (endTime.isBefore(pcEnd) && endTime.isAfter(pcStart) ) {
          errors.endOverlap = true;
          errors.badEnd=true;
        }
        //check for the full overlap
        if (startTime.isBefore(pcStart) && endTime.isAfter(pcEnd) ) {
          errors.fullOverlap = true;
          errors.badStart=true;
          errors.badEnd=true;
        }
      }
    });
    this.set('validationErrors', errors);
  }
});
