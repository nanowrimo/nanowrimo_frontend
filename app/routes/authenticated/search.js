import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';


export default Route.extend({
  session: service(),
  
  model(params) {
    console.log(JSON.stringify(params));
    // Define the search URL
    if (params.input) {
      //define the API url for processing the SSO request
      let url = `${ENV.APP.API_HOST}/search/?input=${params.input}`;
      //get the session auth token so we can add it to the request header
      let { auth_token }  = this.get('session.data.authenticated');
      //console.log('searching');
      return fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((resp)=>{
        return resp.json().then((json)=>{
          return json;
        });
      });
    }
  }
});
