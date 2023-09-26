//import Route from '@ember/routing/route';
import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model(){
    return new Promise((resolve)=> {resolve();});
  }
});
