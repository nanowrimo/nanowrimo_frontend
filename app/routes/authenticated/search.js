import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';


export default Route.extend({
  session: service(),
  
  model(params) {
    // Define the search URL
    if (params.q) {
      //define the API url for processing the SSO request
      let url = `${ENV.APP.API_HOST}/search/?q=${params.q}`;
      //get the session auth token so we can add it to the request header
      let { auth_token }  = this.get('session.data.authenticated');
      return fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((resp)=>{
        return resp.json().then((json)=>{
          return { searchResults: json, searchString: params.q }
        });
      });
    }
  }
});
