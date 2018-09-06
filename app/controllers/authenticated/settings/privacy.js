import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import User from 'nanowrimo/models/user';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),
  optionsForPrivacy: computed(function() {
    return User.optionsForPrivacy;
  }),
  // For displaying response messages
  _formResponseMessage: null,
  formResponseMessage: computed('_formResponseMessage',function() {
    return this.get('_formResponseMessage');
  }),
  
  errorString: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'string') ? error : null;
  }),

  errorObject: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'object') ? error : null;
  }),

  
  actions: {
    //willTransition: function(transition) {
      //this.set('_formResponseMessage',null);
    //},
    afterSubmit() {
    }
  }
  
});
