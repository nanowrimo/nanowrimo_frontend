import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
import {computed} from '@ember/object';
//import fetch from 'fetch';

export default Controller.extend({
  emailError: false,
  successMessage: false,
  errorMessage: null,
  
  displayForm: computed('successMessage', function(){
    return !this.get('successMessage');
  }),
  
  cardTitle: computed('successMessage', 'errorMessage', function(){
    let sm = this.get('successMessage');
    if (sm) {
      return "Great! Check your email.";
    } else { 
      return "Let's get your password reset";
    }
  }),
  
  cardInstruction: computed('successMessage', 'errorMessage', function(){
    let sm = this.get('successMessage');
    if (sm) {
      return "We've sent you a link to reset your password. Please check your email inbox!";
    } else { 
      return "Please enter your email address below and we'll send you a link so you can reset your password!";
    }
  }),
  
  actions: {
    submit(form) {
      let email = form.get('email');
      if (this.validEmail(email) ){
        //perform the query
        let url = `${ENV.APP.API_HOST}/users/forgot_password`;
        // send the data as a POST so that the email doesn't end up in the server logs
        return fetch(url, {
          body: JSON.stringify({email: email}),
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }).then((response) => {       
          if (!response.ok) {
            // what should happen here?
          }
          return response.json().then((json) => {
            if (json.error) {
              this.set('errorMessage', json.error);
            }else if (json.message) {
              this.set('successMessage', json.message);
            }
          });
        });
      }
    },
    emailChange: function(val) {
      if (this.get('emailError') ){
        if (this.validEmail(val) ) {
          this.set('emailError', false);
        }
      }
    }
  },
  
  validEmail: function(value) {
    
    return (value.includes("@") && value.includes("."));
  },
});
