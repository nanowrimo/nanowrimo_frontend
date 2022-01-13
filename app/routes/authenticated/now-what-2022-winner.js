import Route from '@ember/routing/route';
//import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  templateName: '404',
  model() {
    let cu = this.get('currentUser.user');
    let winner = cu.wonEventByName("Now What 2022");
    if (!winner) {
      // return and the default 404 will be displayed
      return;
    }

    let endpoint =  `${ENV.APP.API_HOST}/pages/now-what-2022-winner?user_id=`+cu.get('id');
    return fetch(endpoint).then((data)=>{
      return data.json().then((json)=>{
        return json;
      });
    });
  },

});
