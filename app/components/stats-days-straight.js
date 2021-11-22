import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { computed } from '@ember/object';
import moment from 'moment';

export default ChartBaseComponent.extend({
  user: null,
  projectChallenge: null,
  
  aggregatesWithCounts: computed('projectChallenge.dailyAggregates.[]', function(){
    let aggs = this.get('projectChallenge.dailyAggregates');
    let goodAggs =[];
    if (aggs) {
      aggs.forEach((agg)=>{
        if (agg.count>0) {
          goodAggs.pushObject(agg);
        }
      });
    }
    console.log(goodAggs);
    return goodAggs;
  }),
  
  daysStraight: computed('aggregatesWithCounts.[]', function(){
    // get the aggregates 
    let aggs = this.get('aggregatesWithCounts');
    // if there are no aggregates, return
    if (!aggs.length) {
      return 0;
    }
    // sort the aggregates by day
    aggs = aggs.sortBy("day");
    console.log(aggs);
    // is the last aggregate from today or yesterday?
    let lastAgg = aggs[aggs.length-1];
    
    // if the lastAgg is not today or yesterday, return 0
     let todayInUserTZ = this.get('user.currentDateStringInTimeZone'); 
    /* get yesterday's date in the user's tz*/
    // now minus 1 day
    let yesterday = moment().subtract(1,'d');
    let yesterdayInUserTZ = this.get('user').dateStringInTimeZone(yesterday); 
    if(lastAgg.day!=yesterdayInUserTZ && lastAgg.day!=todayInUserTZ) {
      return 0;
    }
    
    var daysStraight=1; // assume the first aggregate counts as 1
    
    // loop through the aggs
    for (var i=0; i<aggs.length; i++) {
      var agg = aggs[i];
      if (i > 0 ) { // this is NOT the first aggregate
        // is current agg.day 1 day greater than previous day?
        if (moment(agg.day).isSame(moment(prevDay).add(1,'d'),'d')) {
          daysStraight+=1;
        } else if (moment(agg.day).isSame(moment(prevDay),'d'))
          // this is a duplicate day, which should not be possible, so ignore it
        } else {
          daysStraight=1;
        }
      }
      // set the prevDay to the current agg.day
      var prevDay = agg.day;
    }
    return daysStraight;
  })
});
