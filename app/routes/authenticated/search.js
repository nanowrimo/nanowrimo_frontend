import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';
import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  session: service(),
  queryParams: {
    q : {
      refreshModel: true
    }
  },
  model(params) {
    // Define the search URL
    if (params.q) {
      //define the API url for search requests 
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
