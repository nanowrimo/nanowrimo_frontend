import Route from '@ember/routing/route';
import ENV from 'nanowrimo/config/environment';
//import fetch from 'fetch';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  
  model(params){
    //define the API url for processing the SSO request
    let url = `${ENV.APP.API_HOST}/discourse/sso?sig=${params.sig}&sso=${params.sso}`;
    //get the session auth token so we can add it to the request header
    let { auth_token }  = this.get('session.data.authenticated');
    return fetch(url, {
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
    }).then((resp)=>{
      return resp.json().then((json)=>{
        return json;
      });
    });
  }
});
