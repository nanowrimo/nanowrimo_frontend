import Component from '@ember/component';
import { computed }  from '@ember/object';
import { filterBy, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  currentUser: service(),
  store: service(),
  newDuration:null,
  displayName: null,
  displayStartsAt: null,
  displayEndsAt: null,
  validationErrors: null,
  editing: false,
  newStartsAt: null,
  newEndsAt:null,
  //challenge stuff
  associateWithChallenge:false,
  associatedChallenge: null,
  hasValidationError: false,
  
  canEditName: computed('projectChallenge', function(){
    if (this.get('editing') ){
      let cuid = this.get('projectChallenge.challenge.userId');
      let uid = this.get('currentUser.user.id');
      return cuid == uid;
    } else {
      return true;
    }
  }),
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  disableName: computed('canEditName','associateWithChallenge', function(){
    return !this.get('canEditName') || this.get('associateWithChallenge');
  }),
  
  disableWritingType: computed('associateWithChallenge', function(){
    let retval = false;
    //only disable if the associating with a NaNo event AKA eventType: 0
    if (this.get('associateWithChallenge')) {
      if (this.get('associatedChallenge.eventType')==0) {
        retval=true;
      }
    }
    if (this.get('projectChallenge.challenge.eventType')==0) {
      retval=true;
    }
    return retval;
  }),
  
  disableStartEnd: computed('associateWithChallenge', function(){
    let retval = false;
    //only disable if the associating with a NaNo event AKA eventType: 0
    if (this.get('associateWithChallenge')) {
      let et = this.get('associatedChallenge.eventType');
      if (et==0 || et==1) {
        retval=true;
      }
    }
    if (this.get('projectChallenge.challenge.isNaNoEvent')){
      retval=true;
    }
    return retval;
  }),
  
  disableGoal: computed('associateWithChallenge', function(){
    let retval = false;
    //only disable if the associating with a NaNo event AKA eventType: 0
    if (this.get('associateWithChallenge')) {
      if (this.get('associatedChallenge.eventType')==0) {
        retval=true;
      }
    }
    if (this.get('projectChallenge.challenge.eventType')===0){
      retval=true;
    }
    return retval;
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
  
  filteredOptionsForChallenges: filterBy('baseChallenges', "isNaNoEvent", true),
  unassignedOptionsForChallenges: computed('project.projectChallenges.[]', 'filteredOptionsForChallenges', function() {
    let newArray = [];
    let fofcs = this.get('filteredOptionsForChallenges');
    let pcs = this.get('project.projectChallenges');
    fofcs.forEach(function(fofc) {
      let found = false;
      pcs.forEach(function(pc) {
        let id = pc.get('challenge.id');
        if (id === fofc.id) {
          found = true;
        }
      });
      if (!found) {
        newArray.push(fofc);
      }
    });
    return newArray;
  }),
  optionsForChallenges: sort('unassignedOptionsForChallenges','challengeSortingDesc'),
  
  baseChallenges:  computed(function() {
    return this.get('store').findAll('challenge');
  }),
  optionsForWritingType: computed(function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
  }),

  actions: {
     associateChallengeSelect(challengeID) {
      this.set('associatedChallenge', this.get('optionsForChallenges').findBy("id", challengeID));
    },
    clickedAssociateCheckbox() {
      this.toggleProperty("associateWithChallenge");
      if (this.get('associateWithChallenge')) {
        //get the challenge
        if (this.get("associatedChallenge") === null) {
          //set the challenge id to the id of the first object in options for Challenges
          this.set('associatedChallenge', this.get('optionsForChallenges.firstObject'));
        }
        this._setProjectChallengeFromChallenge();
        
      } else {
        //reset the project Challenge
        // The following line threw the error 'this._resetProjectChallenge is not a function'. What is it suppposed to do?
        //this._resetProjectChallenge();
      }
    },
    
    goalChange(v) {
      this.set("projectChallenge.goal", v);
    },
    onShow() {
      let pc = this.get('projectChallenge');
      //we are editing if the projectChallenge has been persisted and has an id
      if (pc && pc.id ){ 
        this.set('editing', true);
        this.set('newDuration', pc.duration);  
        this.set('displayStartsAt', moment.utc(pc.startsAt).format("YYYY-MM-DD"));
        this.set('displayEndsAt', moment.utc(pc.endsAt).format("YYYY-MM-DD"));
        this.set('displayName', pc.name);
        this.set('newStartsAt', pc.startsAt);
        this.set('newEndsAt', pc.endsAt);
      } else {
        this._newProjectChallenge();
      }
    },
    
    onHidden() {
      this.set('open', false);
    },
    saveProjectChallenge() {
      this._validate();
      if (this.get('projectChallengeIsValid') ){
        //hide the modal
        this.set('open', false);
        //assign the project to the project challenge
        let pc = this.get('projectChallenge');
        pc.set('project', this.get('project'));
        //set the project-challenge starts at
        pc.set('startsAt', moment.utc(this.get('newStartsAt')).toDate() );
        pc.set('endsAt', moment.utc(this.get('newEndsAt')).toDate() );
        //are we associating with an event?
        if (this.get('associateWithChallenge') ) {
          pc.set('challenge', this.get('associatedChallenge'));
        } else {
          pc.set('name', this.get('displayName'));
        }
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
    
    startsAtChanged(val) {
      //set the new StartsAt
      let m = moment.utc(val);
      this.set('newStartsAt', m);
      this._validate();
    },
    
    endsAtChanged(val) {
      //set the new StartsAt
      let m = moment.utc(val);
      this.set('newEndsAt', m);
      this._validate();
    }
  },

  _newProjectChallenge(){
    if (this.get('associateWithChallenge')) {
      this.toggleProperty("associateWithChallenge");
    }
    let projectChallenge = this.get('store').createRecord('projectChallenge');
    this.set('projectChallenge', projectChallenge);
    projectChallenge.set('name',"My New Goal");
    this.set('displayName', "My New Goal");
    projectChallenge.set('unitType',"0");
    projectChallenge.set('goal',50000);
    let now = moment();
    this.set('displayStartsAt', now.format("YYYY-MM-DD"));
    projectChallenge.set('startsAt', now.toDate()); 
    this.set('newStartsAt', now.toDate());
    projectChallenge.set('endsAt', now.add(30,'d').toDate()); 
    this.set('displayEndsAt', now.format("YYYY-MM-DD"))
    this.set('newEndsAt', now.toDate());
    this.set('newDuration', 30);
  },
  
  _setProjectChallengeFromChallenge(){
    let projectChallenge = this.get('projectChallenge');
    let challenge = this.get('associatedChallenge');
    projectChallenge.set('name',challenge.name);
    projectChallenge.set('unitType',"0");
    projectChallenge.set('goal',challenge.defaultGoal);
    let start = moment.utc(challenge.startsAt);
    let end = moment.utc(challenge.endsAt);
    this.set('displayStartsAt', start.format("YYYY-MM-DD"));
    this.set('displayEndsAt', end.format("YYYY-MM-DD"));
    projectChallenge.set('startsAt', challenge.startsAt); 
    
    projectChallenge.set('endsAt', challenge.endsAt); 
    this.set('newEndsAt', moment.utc(challenge.endsAt).toDate());
    this.set('newStartsAt', moment.utc(challenge.startsAt).toDate());
    this.set('newDuration', challenge.duration);
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
    let errors = {"endsBeforeStart": false, "startOverlap":false, "endOverlap": false, "fullOverlap":false, "badEnd":false, "badStart":false };
    //get the proposed start and end as moments
    let startTime = moment.utc(this.get('newStartsAt'));
    let endTime = moment.utc(this.get('newEndsAt'));
    errors.endsBeforeStart = endTime.isBefore(startTime);
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
    //assume no errors were found
    this.set('hasValidationError', false);
    //loop through the errors array to determine if there is an error
    Object.keys(errors).forEach((k)=>{
      if( errors[k] ){
        this.set('hasValidationError', true);
      }
    });
  }
});
