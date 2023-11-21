import Route from '@ember/routing/route';
//import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  templateName: '404',
  model() {
    let endpoint =  `${ENV.APP.API_HOST}/pages/winner-offers-2023`;
    let { auth_token } = this.get('session.data.authenticated');
    return fetch(endpoint,{
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((data)=>{
      return data.json().then((json)=>{
        return json;
      });
    });
  },

});
