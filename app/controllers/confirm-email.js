import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';
export default Controller.extend({
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
    let verifyUrl = `${ENV.APP.API_HOST}/users/confirm?token=${t}`
    console.log(verifyUrl);
     return fetch(verifyUrl).then((response) => {
       
      if (response.status !== 200) {
        this.set("errorMessage", "Cannot verify confirmation token");
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

});
