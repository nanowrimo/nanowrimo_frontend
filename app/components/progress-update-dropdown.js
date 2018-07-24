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
  
  primaryProject: computed("user.primaryProject", function(){
    return this.get('user.primaryProject');
  }),

  init() {
    this._super(...arguments);
    let user = this.get('currentUser.user');
    this.set('user',  user);
  },

  actions: {
    showForm(){
      //reset values
      this.set('countType',0);
      this.set('countValue', this.get("primaryProject.unitCount"));
      this.set('initialValue', this.get("primaryProject.unitCount"));
      this.set('showForm', true);
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
        this.set('countValue', this.get("primaryProject.unitCount"));
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
        let iv = this.get("initialValue");
        count -= iv;
      }
      if (count != 0) {
        session.set('count', count);
        session.save();
      }
      this.set('showForm', false);
      return false;
    }
  }
});
