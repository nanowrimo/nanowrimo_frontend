import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';

export default Route.extend({
  templateName: '404',
  model(params) {
    if (params.path) {
      let endpoint =  `${ENV.APP.API_HOST}/pages/${params.path}`;
      console.log(endpoint);
      return fetch(endpoint).then((data)=>{
        return data.json().then((json)=>{
          return json;
        });
      });
    }
  }
});
