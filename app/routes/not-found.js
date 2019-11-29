import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';


export default Route.extend({
  currentUser: service(),
  templateName: '404',
  model(params) {
    if (params.path) {
      let cu = this.get('currentUser');
      let id = 0;
      if (cu) {
        id = cu.get('user.id');
      }
      let endpoint =  `${ENV.APP.API_HOST}/pages/${params.path}`;
      if (id) {
        endpoint += '?user_id='+id;
      }
      return fetch(endpoint).then((data)=>{
        return data.json().then((json)=>{
          return json;
        });
      });
    }
  }
});
