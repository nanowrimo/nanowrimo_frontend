import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { computed } from '@ember/object';
import moment from 'moment';

export default ChartBaseComponent.extend({
  
  days: computed('sessions.[]', function(){
    let sessions = this.get('sessions');
    //are there sessions?
    if (sessions) {
      let hasDay = true;
      let dayCount = 0;
      let targetDay = moment();
      while(hasDay) {
         let foundDay = false;
        //loop through the sessions
        for (var i = 0 ; i < sessions.length ; i++) {
          //get the session
          let sess = sessions.objectAt(i);
          //was this session created on the target day?
          if (moment(sess.end).isSame(targetDay, 'day')) {
            //yes, we found the day
            foundDay = true;
            //incrementthe dayCount
            dayCount++;
            //decrement the target day
            targetDay.subtract(1, 'd');
            //break the loop for efficient
            break;
          }
        } 
        //was a day found?
        if (!foundDay) {
          hasDay = false;
        }
      }
      return dayCount;
    }
  })
});
