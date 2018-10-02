import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import TimeZones from 'nanowrimo/lib/time-zones';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),
  newEmail: null,
  newPassword: null,
  showPasswordConfirm: false,
  // For displaying response messages
  _formResponseMessage: null,
  formResponseMessage: computed('_formResponseMessage',function() {
    return this.get('_formResponseMessage');
  }),
  
  // Hides or shows the password fields depending on whether the user has a password
  registrationPath: computed('currentUser.user.registrationPath',function() {
    return this.get('currentUser.user.registrationPath');
  }),
  // Hides or shows the password fields depending on whether the user has a password
  hasPassword: computed('registrationPath',function() {
    let rp = this.get('registrationPath');
    return (rp === 'email')
  }),
  errorString: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'string') ? error : null;
  }),

  errorObject: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'object') ? error : null;
  }),

  
  timeZoneOptions: computed(function() {
    //let c = this.get('currentUser.user.projects');
    return TimeZones;
  }),
  
  actions: {
    //willTransition: function(transition) {
      //this.set('_formResponseMessage',null);
    //},
    newPasswordChanged(val) {
      if (val) {
        this.set("showPasswordConfirm", val.length > 0);
      }
    },
    
    afterSubmit() {
      let u = this.get('currentUser.user');
      let ne = this.get('newEmail');
      let r = "Your changes have been saved.";
      if (u.email != ne && ne != null) {
        r = r + " We've sent a confirmation email to " + ne + ". Please check your email to complete the change of email address.";
      }
      this.set('_formResponseMessage',r);
    }
  }
  
});
