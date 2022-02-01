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
  
  // return the event_type as defined in the API
  eventType: computed('badge', function(){
    let b = this.get('badge');
    if (b.title.includes("Camp")) {
      return 1;
    }else if (b.title.includes("What") ){
      return 3;
    }else{
      return 0;
    }
  }),
  
  isNaNo: computed('badge', function() {
    //get the badge 
    let b = this.get('badge');
    if (b) {
      return !b.title.includes("Camp");
    }
  }),
  
  winnerText: computed("eventType", function(){
    let et = this.get('eventType');
    switch(et) {
      case 0:
        return "Congratulations! You met your NaNoWriMo goal head on, never gave up, and completed your novel!"
      case 1:
        return  "Congratulations! You met your Camp goal head on, never gave up, and completed your writing project!"
      case 3:
        return "Congratulations! You met your \"Now What?\" goal head on, never gave up, and completed your revision goal!"
    }
  }),
  
  winnerImage: computed('eventType', function(){
     let et = this.get('eventType');
    switch(et) {
      case 0:
        return  "/images/splash/NaNo-2021-Winner-Certificate.png";
      case 1:
        return "/images/splash/Camp-2021-Winner-Certificate.jpg";
      case 3:
        return "/images/splash/now-what-cert.png";
    }
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
    if (data) {
      let id = data.challenge_id;
      //get the related challenge from the store
      var store = this.get('store');
      var event = store.peekRecord('challenge', id);
      return event.name;
    }
    return null;
  }),
  
  hasEventName: computed('eventName', function() {
    let eventName = this.get('eventName');
    return eventName != null;
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
