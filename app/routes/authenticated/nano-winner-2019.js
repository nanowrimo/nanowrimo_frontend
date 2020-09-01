import Route from '@ember/routing/route';
//import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  templateName: '404',
  model() {
    let cu = this.get('currentUser.user');
    let winner = cu.wonEventByName("NaNoWriMo 2019");
    if (!winner) {
      // return and the default 404 will be displayed
      return;
    }

    let endpoint =  `${ENV.APP.API_HOST}/pages/nano-winner-2019?user_id=`+cu.get('id');
    return fetch(endpoint).then((data)=>{
      return data.json().then((json)=>{
        return json;
      });
    });
  },

});
