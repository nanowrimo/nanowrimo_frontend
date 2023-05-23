import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  router: service(),
  
  goalMet: computed('percentCompleted', function() {
    return this.get('percentCompleted') >= 100;
  }),
  
  percentCompleted: computed('projectChallenge.projectSessions.[]', function(){
    let pc = this.get('projectChallenge');
    let g = pc.goal;
    let c = pc.count;
    
    let percent = c*100/g; 
    if (percent>100) {
      percent=100;
    }
    return percent;
  }),
  
  winnerRoute: computed('projectChallenge.eventType', 'goalMet', function() {
    let type = this.get('projectChallenge.eventType');
    if (type < 2 || type==3){ // event is NaNoWriMo or Camp
      // get the event name 
      let name = this.get('projectChallenge.name');
      let gm = this.get('goalMet');
      if (name && gm) {
        // convert the name
        name = name.toLowerCase().replace(/ /g,"-")+"-winner";
        // return the route
        let route = `authenticated.${name}`;
        let router = this.get('router');
        try {
          router.urlFor( route );  // if this fails, no route exists
          return route;
        } catch (error) {
          // bummer
        }
      }
    }
    return null;
  }),
  
  goalIcon: computed("projectChallenge.eventType",function(){
    let str = '';
    let et = this.get('projectChallenge.eventType');
    if (et==0) {
      str = "<img src='/images/global/helmet.svg' style='' />";
    }
    if (et==1) {
      str = "<img src='/images/global/tent.svg' style='' />";
    }
    if (et==3) {
      str = "<img src='/images/global/now-what-pen.svg' style='' />";
    }
    return str;
  }),
  
  formattedStart: computed('projectChallenge', function() {
    let proj = this.get('projectChallenge');
  
    if (proj) {
      let start = proj.startsAt;
      let time = moment.utc(start);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return time.format("MMM YYYY");
      } else {
        return time.format("MMM. YYYY");
      }
    } else {
      return '';
    }
  }),
  
  
});
