import Route from '@ember/routing/route';
//import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  templateName: '404',

  model() {
    // the user is a winner, fetch their winners page
    let endpoint =  `${ENV.APP.API_HOST}/pages/camp-nanowrimo-april-2020-winner`;
    return fetch(endpoint).then((data)=>{
      return data.json().then((json)=>{
        return json;
      });
    });
  },

});
