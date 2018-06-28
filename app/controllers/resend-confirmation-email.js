import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';
export default Controller.extend({
  emailError: false,
  successMessage: false,
  errorMessage: null,
  actions: {
    submit(form) {
      let email = form.get('email');
      if (this.validEmail(email) ){
        //perform the query
        let url = `${ENV.APP.API_HOST}/users/resend_confirmation`;
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
