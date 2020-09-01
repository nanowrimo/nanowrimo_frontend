import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
import {computed} from '@ember/object';
import { inject as service } from "@ember/service";
//import fetch from 'fetch';

export default Controller.extend({
  session: service(),
  confirmed: false,
  token: null,
  hasToken: false,
  init(){
    this._super(...arguments);
    //add an observer to the token
    this.addObserver('token', this, 'tokenDidChange');
  },
  
  displayForm: computed('confirmed', function(){
    return !this.get('confirmed');
  }),
  
  actions: {
    confirmDelete: function(){
      /* PUT request the unsubscribe endpoint with the token as playload */
      //get the token
      let token = this.get('token');
      //define the endpoint
      let endpoint = `${ENV.APP.API_HOST}/users/delete-account`;
      // perform the request 
      fetch(endpoint, 
        {
          body: JSON.stringify({token: token}),
          method: 'POST',
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
                //de-auth the user 
                this.get('session').invalidate();
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
      this.set('hasToken', true);
    }
  }
});
