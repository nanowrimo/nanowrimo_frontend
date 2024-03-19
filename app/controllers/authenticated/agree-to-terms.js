import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Controller.extend({
  router :service(),
  currentUser :service(),
  termsText: null,
  conductText: null,
  
  init() {
    this._super(...arguments);
    this.getTerms();
    this.getConduct();
  },

  actions: {
    onSubmit(){
      event.preventDefault;
      let u = this.get('currentUser.user');
      u.agreedToTerms = new Date();
      u.save().then(()=>{
        // does the currentUser.user have an accepted terms?
        if (this.get('currentUser.user.agreedToTerm') !== null) {
          //redirect to dashboard
          document.location.href = "/dashboard";
          //this.get('router').transitionTo('authenticated.dashboard');
        }
          
      });
   }
  },
  getTerms(){
    //get the html from /pages/terms-and-conditions
    let url = `${ENV.APP.API_HOST}/pages/terms-and-conditions`;
    // send the data as a POST so that the email doesn't end up in the server logs
    return fetch(url, {

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
        }else {
          this.set("termsText", json.data.attributes.body);
        }
      });
    });
  },
  getConduct(){
    //get the html from /pages/terms-and-conditions
    let url = `${ENV.APP.API_HOST}/pages/codes-of-conduct`;
    // send the data as a POST so that the email doesn't end up in the server logs
    return fetch(url, {

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
        }else {
          this.set("conductText", json.data.attributes.body);
        }
      });
    });
  }
});
