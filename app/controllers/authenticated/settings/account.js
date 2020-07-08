import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import TimeZones from 'nanowrimo/lib/time-zones';
import $ from 'jquery';

export default Controller.extend({
  error: null, // String OR object
  store: service(),
  currentUser: service(),
  formID: null,
  formChangeCount: 0,
  nameErrorMessage: null,
  emailErrorMessage: null,
  passwordErrorMessage: null,
  currentPasswordError: null,
  showPasswordConfirm: false,
  confirmationPasswordErrorMessage: null,
  currentName:null,
  currentEmail:null,
  currentTimeZone:null,
  newEmail:null,
  
  init(){
    this._super(...arguments);
    let u = this.get("currentUser.user");
    this.set('user', u );
    this.set('formID', "account-settings");
    this.set('currentName', u.name);
    this.set('currentEmail', u.email);
    this.set('currentTimeZone', u.timeZone);

  },
  
  timeZoneOptions: computed(function() {
    return TimeZones;
  }),
  
  // For displaying response messages
  _formResponseMessage: null,
  formResponseMessage: computed('_formResponseMessage',function() {
    return this.get('_formResponseMessage');
  }),
  
  // Hides or shows the password fields depending on whether the user has a password
  registrationPath: computed('user.registrationPath',function() {
    return this.get('user.registrationPath');
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
  
  hasChangedValues: computed('formChangeCount', function(){
    //get the form
    let user = this.get('user');
    let id = this.get('formID')
    let form = $(`#${id}`)[0];
    if (form.username.value != user.name) return true;
    if (form.email.value != user.email) return true;
    if (form.timezone.value != user.timeZone) return true;
    if(form.password.value) {
      if (form.currentPassword.value) return true;
    }
    return false;
  }),
  
  actions: {
    nameChanged() { 
      if (event.code!=="Enter") { // ignore the 'enter' key
        this.set('nameErrorMessage', null);
        this.changesHappened();
      }
    },
    
    emailChanged() {
      this.set('emailErrorMessage', null);
      this.changesHappened();
    },
    
    timeZoneChanged() {
      this.changesHappened();
    },
    
    newPasswordChanged(val) {
      this.set("showPasswordConfirm", val.length > 0);
      this.changesHappened();
    },
    currentPasswordChanged() {
      this.set('confirmationPasswordErrorMessage', null);
      this.changesHappened();
    },
    
    submit() {
      let self = this;
      //get the form
      let id = this.get('formID')
      let form = $(`#${id}`)[0];
      //attempt to update current user,
      let user = this.get('user');
      let name = form.username.value;
      let email = form.email.value;
      let password = form.password.value;
      let currentPassword='';
      if(password){
        currentPassword = form.currentPassword.value;
      }
      let timezone = form.timezone.value;
      
      
      let hasError = false;
      //simple validation
      if (name.length===0) {
        hasError = true;
        this.set('nameErrorMessage', "Username cannot be blank");
      }
      if (email.length===0) {
        hasError = true;
        this.set('emailError', "Email cannot be blank");
      }
      if (password.length>0) {
        if (currentPassword.length==0) {
          hasError = true;
          this.set("currentPasswordErrorMessage", "Current Password is required");
        }
      }
      
      //if there are no errors...
      if(!hasError) {
        //update the user and submit
        user.set('name', name);
        user.set('email', email);
        this.set('newEmail', email);
        if(password){
          user.set('newPassword', password);
          user.set('currentPassword', currentPassword);
        }
        user.set('timeZone', timezone);
        
        return user.save().then(()=>{
          self.afterSubmit();
        }).catch((error)=>{
          this.processErrors(error.errors);
        });
      }
    },
    
    reset() {
      //get the form
      let id = this.get('formID')
      let form = $(`#${id}`)[0];
      //update values
      form.username.value = this.get('currentName'); 
      form.email.value = this.get('currentEmail'); 
      form.password.value = '';
      form.timezone.value = this.get('currentTimeZone');
      //don't show the password confirm
      this.set("showPasswordConfirm", false);
      //consider a reset a form change 
      this.incrementProperty('formChangeCount');
      //reset all of the error messages
      this.set('confirmationPasswordErrorMessage', null);
      this.set('nameErrorMessage', null);
      this.set('emailErrorMessage', null);
      this.changesHappened();
    }
  },
  
  changesHappened() {
    this.set("_formResponseMessage","");
    this.incrementProperty('formChangeCount');
  },
  
  afterSubmit() {
    this.set('confirmationPasswordError', false);
    let u = this.get('user');
    let ne = this.get('newEmail');
    let r = "Your changes have been saved.";
    if (u.email != ne && ne != null) {
      r = r + " We've sent a confirmation email to " + ne + ". Please check your email to complete the change of email address.";
    }
    this.set('_formResponseMessage',r);
  },
  processErrors(errors){    
    errors.forEach((error)=>{
      if (error.title=="BAD-AUTH") {
        this.set('confirmationPasswordErrorMessage', error.detail);
      }
      if (error.title.includes("NAME") ){
        this.set('nameErrorMessage', error.detail);
        this.set('user.name', this.get('currentName'));
      }
      if (error.title.includes("EMAIL") ){
        this.set('emailErrorMessage', error.detail);
        this.set('user.email', this.get('currentEmail'));
      }
    });
  }
  
});
