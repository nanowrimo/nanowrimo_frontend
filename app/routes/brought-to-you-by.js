import Route from '@ember/routing/route';
import ENV from 'nanowrimo/config/environment';

export default Route.extend({
  model(){
    let endpoint = `${ENV.APP.API_HOST}/donors`;
    return fetch(endpoint).then(response=>{ return response.json() });
  }
});
