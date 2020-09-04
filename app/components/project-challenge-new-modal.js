import Component from '@ember/component';
import { computed }  from '@ember/object';
import { sort } from '@ember/object/computed';
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
  isEditingModal: false,
  newStartsAt: null,
  newEndsAt:null,
  //challenge stuff
  associateWithChallenge:false,
  associatedChallenge: null,
  hasValidationError: false,
  showConfirmDelete: false,
  
  
  init() {
    this._super(...arguments);
    this.set('deleteConfirmationYesText', 'Delete');
    this.set('deleteConfirmationNoText', 'Cancel'); 
    this.set('deleteConfirmationTitleText', 'Confirm Delete');
    this.set('deleteConfirmationQuestion', `Do you really want to delete this goal?`);
  },
  
  canEditName: computed('projectChallenge', 'associateWithChallenge', function(){
    if (this.get('isEditingModal') ){
      //if the goal is no longer associated with a challenge, user can edit name
      let associate = this.get('associateWithChallenge');
      if (!associate) {
        return true;
      }
      let cuid = this.get('projectChallenge.challenge.userId');
      let uid = this.get('currentUser.user.id');
      return cuid == uid;
    } else {
      return true;
    }
  }),
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  disableName: computed('canEditName','associateWithChallenge', function(){
    //can the user edit the original challenge?
    let canEdit = this.get('canEditName');
    if (!canEdit) {
      return true;
    }
    // is there an associated challenge?
    let associated = this.get('associateWithChallenge');
    return associated;
  }),
  
  disableWritingType: computed('associateWithChallenge', function(){
    let retval = false;
    //only disable if the associating with a NaNo event AKA eventType: 0
    if (this.get('associateWithChallenge')) {
      if (this.get('associatedChallenge.eventType')==0) {
        retval=true;
      }
      if (this.get('projectChallenge.challenge.eventType')==0) {
        retval=true;
      }
    }
    return retval;
  }),
  
  disableStart: computed('associateWithChallenge', function(){
    let retval = false;
    //only disable if the associating with a NaNo event AKA eventType: 0
    if (this.get('associateWithChallenge')) {
      let et = this.get('associatedChallenge.eventType');
      if (et==0 || et==1) {
        retval=true;
      }
      if (this.get('projectChallenge.challenge.isNaNoOrCampEvent')){
        retval=true;
      }
    }
    if (this.get('projectChallenge.challenge.hasStarted')){
      retval=true;
    }
    return retval;
  }),
  
  // The end date can't be before now when editing
  endDateMin: computed('associateWithChallenge', function(){
    let min = '1999-07-01';
    if (this.get('projectChallenge.challenge.hasStarted')){
      min = moment().format("YYYY-MM-DD");
    }
    return min;
  }),
  
  disableStartEnd: computed('associateWithChallenge', function(){
    let retval = false;
    //only disable if the associating with a NaNo event AKA eventType: 0
    if (this.get('associateWithChallenge')) {
      let et = this.get('associatedChallenge.eventType');
      if (et==0 || et==1) {
        retval=true;
      }
      if (this.get('projectChallenge.challenge.isNaNoOrCampEvent')){
        retval=true;
      }
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
      if (this.get('projectChallenge.challenge.eventType')===0){
        retval=true;
      }
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
  
  writingType: computed('isEditingModal','associatedChallenge','projectChallenge.writingType',function() {
    let isEditing = this.get('isEditingModal');
    if (isEditing) {
      let pc = this.get('projectChallenge.writingType');
      if (pc==1) {
        return '1';
      } else {
        return '0';
      }
    } else {
      let ac = this.get('associatedChallenge');
      if (ac) {
        return ac.unitTypeAsString;
      }
    }
    return '0';
  }),
  
   // Gets all challenges from the store
  unassignedOptionsForChallenges:  computed('getChallengeOptions', function() {
    return this.get('store').query('challenge',{ available: true});
  }),

  optionsForChallenges: sort('unassignedOptionsForChallenges','challengeSortingDesc'),
  
  optionsForWritingType: computed('associateWithChallenge', function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed('associateWithChallenge', function() {
    return Challenge.optionsForUnitType;
  }),

  actions: {
    
    confirmDelete(){
      //show the delete dialog
      this.set('showConfirmDelete', true);
    },
    
    deleteConfirmationYes(){
      //TODO: delete this projectChallenge
      //get the projectChallenge 
      this.get('projectChallenge').destroyRecord();
      //close the modal
      this.set('showConfirmDelete', false);
    },
    deleteConfirmationNo(){
      //close the modal
      this.set('showConfirmDelete', false);
    },
    
     associateChallengeSelect(challengeID) {
      this.set('associatedChallenge', this.get('optionsForChallenges').findBy("id", challengeID));
      // is associate already checked?
      if (this.get('associateWithChallenge') ) {
        this._setProjectChallengeFromChallenge();
      }
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
        this.set('associatedChallenge', null);
      }
    },
    
    goalChange(v) {
      this.set("projectChallenge.goal", v);
    },
    onShow() {
      let pc = this.get('projectChallenge');
      //we are editing if the projectChallenge has been persisted and has an id
      if (pc && pc.id ){ 
        this.set('isEditingModal', true);
        this.set('newDuration', pc.duration);  
        //this.set('displayStartsAt', moment.utc(pc.startsAt).format("YYYY-MM-DD"));
        //this.set('displayEndsAt', moment.utc(pc.endsAt).format("YYYY-MM-DD"));
        this.set('displayStartsAt', pc.startsAt);
        this.set('displayEndsAt', pc.endsAt);
        this.set('displayName', pc.name);
        this.set('newStartsAt', pc.startsAt);
        this.set('newEndsAt', pc.endsAt);
        // is the project challenge associated with an event? 
        if(pc.computedChallenge.isNaNoOrCampEvent){
          //set the challenge association properties
          this.set('associateWithChallenge', true);
          this.set('associatedChallenge', pc.computedChallenge);
        }
        
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
        //assign the project to the project challenge
        let pc = this.get('projectChallenge');
        pc.set('project', this.get('project'));
        //set the project-challenge starts at
        //pc.set('startsAt', moment.utc(this.get('newStartsAt')).toDate() );
        //pc.set('endsAt', moment.utc(this.get('newEndsAt')).toDate() );
        pc.set('startsAt', this.get('newStartsAt') );
        pc.set('endsAt', this.get('newEndsAt') );
        //are we associating with an event?
        if (this.get('associateWithChallenge') ) {
          pc.set('challenge', this.get('associatedChallenge'));
        } else {
          pc.set('challenge', null);
          pc.set('name', this.get('displayName'));
        }
        pc.save();
        //hide the modal
        this.set('open', false);
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
      //let m = moment.utc(val);
      //this.set('newStartsAt', m);
      this.set('newStartsAt', val);
      this._validate();
    },
    
    endsAtChanged(val) {
      //set the new StartsAt
      //let m = moment.utc(val);
      //this.set('newEndsAt', m);
      this.set('newEndsAt', val);
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
    this.set('displayName', challenge.name);
    projectChallenge.set('unitType',challenge.unitType);
    projectChallenge.set('goal',challenge.defaultGoal);
    //let start = moment.utc(challenge.startsAt);
    //let end = moment.utc(challenge.endsAt);
    //this.set('displayStartsAt', start.format("YYYY-MM-DD"));
    //this.set('displayEndsAt', end.format("YYYY-MM-DD"));
    this.set('displayStartsAt', challenge.startsAt);
    this.set('displayEndsAt', challenge.endsAt);
    projectChallenge.set('startsAt', challenge.startsAt); 
    projectChallenge.set('endsAt', challenge.endsAt); 
    //this.set('newStartsAt', moment.utc(challenge.startsAt).toDate());
    //this.set('newEndsAt', moment.utc(challenge.endsAt).toDate());
    this.set('newStartsAt', challenge.startsAt);
    this.set('newEndsAt', challenge.endsAt);
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
    //let startTime = moment.utc(this.get('newStartsAt'));
    //let endTime = moment.utc(this.get('newEndsAt'));
    let startTime = this.get('newStartsAt');
    let endTime = this.get('newEndsAt');
    //errors.endsBeforeStart = endTime.isBefore(startTime);
    errors.endsBeforeStart = endTime<startTime;
    //loop through this project's projectChallenges
    let pcs = this.get('project.projectChallenges');
    
    pcs.forEach((pc)=>{
      //don't validate against self
      if (pc !== currentpc) {
        //let pcStart = moment(pc.startsAt);
        //let pcEnd = moment(pc.endsAt);
        //check for a start overlap
        //if (startTime.isBefore(pcEnd) && startTime.isAfter(pcStart) ) {
        if (startTime<pc.endsAt && startTime>pc.startsAt ) {
          errors.startOverlap = true;
          errors.badStart=true;
        }
        //check for an end overlap
        //if (endTime.isBefore(pcEnd) && endTime.isAfter(pcStart) ) {
        if (endTime<pc.endsAt && endTime>pc.startsAt ) {
          errors.endOverlap = true;
          errors.badEnd=true;
        }
        //check for the full overlap
        //if (startTime.isBefore(pcStart) && endTime.isAfter(pcEnd) ) {
        if (startTime<pc.startsAt && endTime>pc.endsAt ) {
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
