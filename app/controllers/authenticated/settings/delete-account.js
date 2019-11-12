import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
import {computed} from '@ember/object';
import {inject as service } from "@ember/service";
import fetch from 'fetch';

export default Controller.extend({
  session: service(),
  deleteButtonDisabled: false,

  user: computed('currentUser.user',function() {
    return this.get('currentUser.user');
  }),
  
  actions: {
    requestDelete: function(){
      /* send a put request to /users/request_deletion */
      //get the user's auth token
      let { auth_token }  = this.get('session.data.authenticated');
      //define the endpoint
      let endpoint = `${ENV.APP.API_HOST}/users/request-delete-account`;
      // perform the request 
      fetch(endpoint, 
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': auth_token
          }
        }
      ).then(response=>{
        if (response.ok) {
          this.set('deleteButtonDisabled', true);
        } else {
          // TODO: notify user of an issue 
        }
      });
    },
  }
});
