import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
import {computed} from '@ember/object';
import fetch from 'fetch';

export default Controller.extend({
  emailError: false,
  successMessage: false,
  errorMessage: null,
  
  displayForm: computed('ptoken','successMessage', function(){
    return !this.get('successMessage');
  }),
  
  cardInstruction: computed('successMessage', 'errorMessage', function(){
    let sm = this.get('successMessage');
    if (sm) {
      return "You have been unsubscribed from NaNoWriMo emails.";
    } else { 
      return "Are you sure you wish to unsubscribe?";
    }
  }),
  
  actions: {
    confirmUnsubscribe: function(){
      /* PUT request the unsubscribe endpoint with the token as playload */
      //get the token
      let token = this.get('token');
      //define the endpoint
      let endpoint = `${ENV.APP.API_HOST}/unsubscribe`;
      // perform the request 
      fetch(endpoint, 
        {
          body: JSON.stringify({token: token}),
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      ).then(response=>{
          response.json().then(data=>{
              if (data.code==200) {
                // success!
                this.set('successMessage', "You have been unsubscribed from emails");
              }
          });
      });
    },
    confirmNoUnsubscribe: function(){
      // redirect to /
      this.transitionToRoute("/");
    }
  }

});
