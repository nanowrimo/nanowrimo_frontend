import Route from '@ember/routing/route';
import ENV from 'nanowrimo/config/environment';

export default Route.extend({
  model(){
    //redirect the Environment's forumsUrl
    window.location.replace(ENV.forumsUrl);
  }
});
