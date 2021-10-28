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
  
  actions: {
    hubAction(){
      document.location.href=" https://store.nanowrimo.org/collections/home-page/products/nanowrimo-extraordinary-helpers";
    }
  },
  
  _checkDonationDayTime(){
    let startTime = "2021-10-30 00:00";
    let endTime = "2021-11-02 00:00";
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
