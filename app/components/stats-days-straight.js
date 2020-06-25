import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { computed } from '@ember/object';
import moment from 'moment';

export default ChartBaseComponent.extend({
  
  daysOld: computed('sessions.[]', function(){
    let sessions = this.get('sessions');
    //are there sessions?
    if (sessions) {
      
      //vars needed for computations
      let dayCount = 0;
      let today = moment();
      let targetDay = moment().subtract(1, 'd');
      
      // attempt to find the days in a row, starting yesterday
      let foundDay = true;
      while (foundDay) {
        //assume a day was not found
        foundDay = false;
        //loop through the sessions
        for (var i =0 ; i < sessions.length ; i++) {
          //get the session
          let sess = sessions.objectAt(i);
          //was this session created on the target day?
          if (moment(sess.end).isSame(targetDay, 'day')) {
            //incrementthe dayCount
            dayCount++;
            // a target day was found
            foundDay = true;
            //decrement the target day
            targetDay.subtract(1, 'd');
            //exit the for loop
            break;
          }
        } 
      }
      
      //was a session created "today"?
      for (i = 0 ; i < sessions.length ; i++) {
        //get the session
        let sess = sessions.objectAt(i);
        //was this session created today?
        if (moment(sess.end).isSame(today, 'day')) {
          //incrementthe dayCount
          dayCount++;
          //exit the for loop
          break;
        }
      } 

      return dayCount;
    }
  }),
  
  days: computed('dailyAggregates.[]', function(){
    let das = this.get('dailyAggregates');
    //are there dailyAggregates?
    if (das) {
      
      //vars needed for computations
      let dayCount = 0;
      let today = moment();
      let targetDay = moment().subtract(1, 'd');
      
      // attempt to find the days in a row, starting yesterday
      let foundDay = true;
      while (foundDay) {
        //assume a day was not found
        foundDay = false;
        //loop through the sessions
        for (var i =0 ; i < das.length ; i++) {
          //get the session
          let da = das.objectAt(i);
          //was this session created on the target day?
          if (moment(da.day).isSame(targetDay, 'day')) {
            //incrementthe dayCount
            dayCount++;
            // a target day was found
            foundDay = true;
            //decrement the target day
            targetDay.subtract(1, 'd');
            //exit the for loop
            break;
          }
        } 
      }
      
      //was a session created "today"?
      for (i = 0 ; i < das.length ; i++) {
        //get the session
        let da = das.objectAt(i);
        //was this session created today?
        if (moment(da.day).isSame(today, 'day')) {
          //incrementthe dayCount
          dayCount++;
          //exit the for loop
          break;
        }
      } 

      return dayCount;
    }
  })
  
});
