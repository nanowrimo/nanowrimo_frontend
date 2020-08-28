import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import ENV from 'nanowrimo/config/environment';
//import fetch from 'fetch';
import { inject as service } from '@ember/service';
export default Controller.extend({
  session: service(),
  flashMessages: service(),
  currentUser: service(),
  confirmedAt: alias('currentUser.confirmedAt'),
  //what queryParams do we care about?
  queryParams: ['token'],
  token: null,
  attemptingVerification: computed("errorMessage", "successMessage", function() {
    return (this.get('errorMessage')===null && this.get('successMessage')===null);
  }),
  errorMessage: null,
  successMessage: null,
  //over ride init() so we can keep an eye on the token query param
  init() {
    this._super(...arguments);
    //watch the token property for a change
    this.addObserver('token', this, 'tokenDidChange');
  },
  tokenDidChange() {
    let t = this.get('token');
    let verifyUrl = `${ENV.APP.API_HOST}/revert-email-change?token=${t}`
     return fetch(verifyUrl).then((response) => {
       
      if (response.status !== 200) {
        this.set("errorMessage", "Cannot verify reversion token");
      }

      return response.json().then((json) => {
        if (json.error) {
          this.set('errorMessage', json.error);
        }else if (json.message) {
          //if the user is signed in
          if (this.get('session.isAuthenticated')) {
            //set a flash 
            this.get('flashMessages').success(json.message);
            //redirect to dashboard
            //this.replaceRoute('/');
            window.location.href = "/";
          } else {
            this.set('successMessage', json.message);
          }

        }
      });
    });
    
  }

});
