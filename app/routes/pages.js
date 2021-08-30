import ScrollRoute from 'nanowrimo/routes/scroll-route'
//import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';


export default ScrollRoute.extend({
  currentUser: service(),
  templateName: '404',
  model(params) {
    if (params.path) {
      let endpoint =  `${ENV.APP.API_HOST}/pages/${params.path}`;
      return fetch(endpoint).then((data)=>{
        return data.json().then((json)=>{
          return json;
        });
      });
    }
  }
});
