import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {computed} from '@ember/object';

export default Component.extend({
  currentUser: service(),
  router: service(),
  step: 0,
  closeAction: null,
  badge: null,
  /* TODO: get the year in YYYY format if it will be necessary to 
    link to /nano-winner-YYYY
  */
  
  
  isNaNo: computed('badge', function() {
    //get the badge 
    let b = this.get('badge');
    return !b.title.includes("Camp");
  }),
  
  winnerImage: computed('isNaNo', function(){
    let i = this.get('isNaNo');
    let path = (i) ? "/images/splash/NaNo-20-Winner-Certificate-Image.jpg" : "/images/splash/Camp-2021-Winner-Certificate.jpg";
    return path;
  }),

  winnerRoute: computed('isNaNo', function(){
    let i = this.get('isNaNo');
    let route = (i) ? "authenticated.nano-winner-2020" : "authenticated.camp-nanowrimo-july-2021-winner";
    return route;
  }),
  
  actions: {
    closeClicked(){
      let ca = this.get('closeAction');
      if (ca) {ca()}
    },
    goToStats(){
      this.send('closeClicked');
      this.get('router').transitionTo('authenticated.stats')
    },
    incrementStep(){
      this.incrementProperty("step");
    },
    decrementStep(){
      this.decrementProperty("step");
    },
    goToWinnerRoute(){
      let route = this.get("winnerRoute");
      this.send('closeClicked');
      this.get('router').transitionTo(route);
    }
  }
});
