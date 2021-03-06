import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  store: service(),
  error: null,
  signInAttempt: null,
  isSubmitting: false,
  
  init(){
    this._super(...arguments);
    let sia = this.get('store').createRecord('sign-in-attempt');
    this.set('signInAttempt', sia);
    this.defaultButton();
  },
  
  actions: { 
    onSubmit() {
      if (this.get('isSubmitting') ) {
        return false;
      } else {
        this.submitting();
      }
      return false;
    },
    signInValidationFailed() {
      this.defaultButton();
    },
    receivedError(e) {
      this.set('error', e);
      this.defaultButton();
    }
  },
  
  // class functions
  submitting: function(){
    this.set('isSubmitting', true);
  },
  
  defaultButton: function() {
    this.set('isSubmitting', false);
  }
});
