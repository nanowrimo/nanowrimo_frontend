import ENV from 'nanowrimo/config/environment';
import ScrollRoute from 'nanowrimo/routes/scroll-route'
//import fetch from 'fetch';

export default ScrollRoute.extend({
  model(){
    let endpoint = `${ENV.APP.API_HOST}/donors`;
    return fetch(endpoint).then(response=>{ return response.json() });
  }
});
