import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from "@ember/object";
export default Component.extend({
  currentUser: service(),
  store: service(),
 
  countType: 0,
  showForm: false,
  user: null,
  countValue: null,
  initialValue: null,

  challengeUnitType: computed("currentUser.user.primaryProject.activeProjectChallenge", function(){
    let apc = this.get('currentUser.user.primaryProject.activeProjectChallenge');
    if (apc) {
      return apc.get('unitType');
    }
  }),
  unit_type_plural: computed("challengeUnitType", function(){
    let type = this.get('challengeUnitType');
    if (type===0) {
      return "words";
    } else if (type===1) {
      return 'hours';
    }
  }),
  
  primaryProject: computed("user.primaryProject", function(){
    let project = this.get('user.primaryProject');
    this.set('countValue', project.unitCount);
    this.set('initialValue', project.unitCount);
    this.set('newPrimaryValue',project.primary+1);
    console.log(this.get('newPrimaryValue'));
    return project;
  }),
  
  init() {
    this._super(...arguments);
    this.set('user', this.get('currentUser.user') );
  },

  actions: {
    showForm(){
      this.set('showForm', true);
      console.log(this.get('user.primaryProject'));
    },
    hideForm(){
      this.set('showForm', false);
    },
    selectChanged(v) {
      //convert the string to integer 
      v = parseInt(v);
      this.set('countType',v);
      if (v === 1) {
        this.set('countValue', 0);
      } else if (v===0){
        this.set('countValue', this.get('initialValue'));
      }
    },
    formSubmit() {
      //what project are we actually dealing with?
      let project = this.get('store').peekRecord('project', this.get('primaryProject.id') );
      //create a session for the primary project 
      let session = this.get('store').createRecord('projectSession');
      session.set('project', project);
      session.set('unitType', 0);
      let count = this.get('countValue');
      //do we need to determine the session count based on the total count?
      if (this.get('countType')===0) {
        //session count is based on total
        count -= this.get('initialValue') ;
      }
      if (count != 0) {
        session.set('count', count);
        session.save();
        this.set('showForm', false);
      }
      return false;
    }
  }
});
