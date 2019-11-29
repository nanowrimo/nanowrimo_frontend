import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  templateName: '404',
  model() {
    let cu = this.get('currentUser.user');
    const winner = cu.currentEventWon;
    let endpoint =  `${ENV.APP.API_HOST}/pages/nano-winner-2019?user_id=`+cu.get('id');
    if (!winner) {
      endpoint =  `${ENV.APP.API_HOST}/pages/how-to-win-nanowrimo`;
    }
    return fetch(endpoint).then((data)=>{
      return data.json().then((json)=>{
        return json;
      });
    });
  },

});
