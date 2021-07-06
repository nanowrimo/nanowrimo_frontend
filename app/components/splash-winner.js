import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {computed} from '@ember/object';

export default Component.extend({
  currentUser: service(),
  store: service(),
  router: service(),
  step: 0,
  closeAction: null,
  badge: null,  
  extraData: null,
  
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

  winnerRoute: computed('eventName', function(){
    // get the event name 
    let name = this.get('eventName');
    if (name) {
      // convert the name
      name = name.toLowerCase().replace(/ /g,"-")+"-winner";
      // return the route
      return `authenticated.${name}`;
    }
    return null;
  }),
  
  eventName: computed('extraData', function() {
    let data = JSON.parse(this.get('extraData'));
    let id = data.challenge_id;
    if (id) {
      //get the related challenge from the store
      var store = this.get('store');
      var event = store.peekRecord('challenge', id);
      return event.name;
    }
    return null;
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
