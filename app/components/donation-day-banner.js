import Component from '@ember/component';
import { later } from '@ember/runloop';
import moment from 'moment';

export default Component.extend({
  displayDonationDayBanner: false,
  
  init(){
    this._super(...arguments);
    //check if the donationDayBanner should be displayed
    this._checkDonationDayTime();
  },
  
  _checkDonationDayTime(){
    let startTime = "2019-11-09 00:00";
    let endTime = "2019-11-09 23:59";
    //rerun this method every minutes
    later(this, "_checkDonationDayTime", 60000);
    let time = moment.tz(moment(), 'America/Los_Angeles').format('YYYY-MM-DD HH:mm');
    let val = false;
    if (time >= startTime && time <=endTime) {
      val = true;
    }
    try {
      this.set('displayDonationDayBanner', val);
    } catch(e){
      //do nothing!
    }
  }
});
