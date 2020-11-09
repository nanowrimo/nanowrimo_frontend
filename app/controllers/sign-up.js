import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

import TimeZones from 'nanowrimo/lib/time-zones';
import moment from 'moment';
//import fetch from 'fetch';

export default Controller.extend({
  session: service(),
  submitDisabled: true,
  emailErrorMessage: null,
  passwordErrorMessage: null,
  nameErrorMessage:null,
  isSubmitting: false,

  timeZoneOptions: computed(function() {
    (TimeZones);
    return TimeZones;
  }),
  
  guessedZone: computed(function(){
    return moment.tz.guess();
  }),
  
  actions: {
    onSubmit(){
      let form = event.target;
      this.validateForm(form);
    },
    emailChanged() {
      if (this.get('emailErrorMessage')!==null ) {
        //wipe the error 
        this.set('emailErrorMessage',null) ;
      }
    },
    nameChanged() {
      if (this.get('nameErrorMessage') ) {
        //wipe the error 
        this.set('nameErrorMessage',null) ;
      }
    },
    termsClicked(val) {
      this.set("submitDisabled", !val);
    }
  },
  
  responseErrors(json){
    let tags = ['email','password','name'];
    // no longer submitting 
    this.set('isSubmitting', false);
    let errors = json.errors;
    (errors);
    (errors.length);
    (typeof(errors));
    //loop through the errors
    errors.forEach((error)=>{
      //loop through the tags
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        //is the tag in the error? lowercase?
        if (error.toLowerCase().includes(tag) ){
          //we found the tag
          this.set(`${tag}ErrorMessage`, error);
          break;
        }
      }
    });
  },
  
  // perform some basic validation and submit if the data is OK
  validateForm(form) {
    let _self = this;
    (form);
    let e = form.email.value;
    let p = form.password.value;
    let u = form.username.value;
    (u);
    (form.username);
    let t = form.timezone.value;
    if (!e && !p && !u){
      ('empty form');
      return;
    }
    let hasErrors = false;
    // check length
    if (e.length==0){ 
      this.set('emailErrorMessage','Email cannot be blank'); 
      hasErrors = true;
    }
    if (u.length==0){ 
      this.set('nameErrorMessage','Username cannot be blank'); 
      hasErrors=true;
    }
    if (p.length==0){ 
      this.set('passwordErrorMessage','Pasword cannot be blank'); 
      hasErrors=true;
    }
    
    //are there errors?
    if(!hasErrors){
      //perform the fetch!
      this.set('isSubmitting', true);
      fetch(`${ENV.APP.API_HOST}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: e, 
          password: p, 
          name: u, 
          time_zone: t
          })
      })
      .then(function(resp){ // process the fetch response
        // is the response not ok? 
        if (resp.ok===false) {
          resp.json().then((json)=>{
            // the response body object contains the errors; parse them
            _self.responseErrors(json);
          });
        } else {
          //all is good ... authenticate the new user
          return _self.get('session').authenticate('authenticator:nanowrimo', e, p);
        }
      })
      .catch(() => {
       //there was a problem, how should it be handled?
      });   
    }
  }
});
