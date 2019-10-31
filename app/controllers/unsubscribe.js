import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
import {computed} from '@ember/object';
import fetch from 'fetch';

export default Controller.extend({
  emailError: false,
  successMessage: false,
  errorMessage: null,
  confirmed: false,
  init(){
    this._super(...arguments);
    //add an observer to the token
    this.addObserver('token', this, 'tokenDidChange');
  },
  
  displayForm: computed('confirmed', function(){
    return !this.get('confirmed');
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
                this.set('confirmed', true);
              }
          });
      });
    },
    confirmNoUnsubscribe: function(){
      // redirect to /
      this.transitionToRoute("/");
    }
  },
  tokenDidChange() {
    let t = this.get('token');
    if(t) {
      //define the endpoint 
      let endpoint  = `${ENV.APP.API_HOST}/unsubscribe/email-for-token`;
      fetch(endpoint, 
          {
            body: JSON.stringify({token: t}),
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
      ).then(response=>{
          response.json().then(data=>{
            this.set('userEmail', data.email);
          });
      });
    }
  }

});
