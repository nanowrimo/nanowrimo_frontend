import Component from '@ember/component';
import { later } from '@ember/runloop';
import moment from 'moment';

export default Component.extend({
  displayPrepDayBanner: false,
  
  init(){
    this._super(...arguments);
    //check if the donationDayBanner should be displayed
    this._checkPrepDayTime();
  },
  
  _checkPrepDayTime(){
    let startTime = "2021-10-06 00:00";
    let endTime = "2021-10-11 00:00";
    //rerun this method every minutes
    later(this, "_checkPrepDayTime", 60000);
    let time = moment.tz(moment(), 'America/Los_Angeles').format('YYYY-MM-DD HH:mm');
    let val = false;
    if (time >= startTime && time <=endTime) {
      val = true;
    }
    try {
      this.set('displayPrepDayBanner', val);
    } catch(e){
      //do nothing!
    }
  }
});
