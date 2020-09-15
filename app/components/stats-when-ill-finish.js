import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import {computed} from '@ember/object';
import moment from 'moment';

export default ChartBaseComponent.extend({
  projectChallenge: null,
  dailyAverage: null,
  user: null,
  
  projectedFinishDate: computed('dailyAverage', function() {
    // 
    //  today's date + (goal remaining / average per day) days  
    let tz = this.get("user.timeZone");
    let date = moment().tz(tz);
    let pc = this.get('projectChallenge');
    let remainingCount = pc.goal - pc.currentCount;
    let average = this.get('dailyAverage');
    let daysToGo = remainingCount/average;
    date.add(daysToGo, 'd');
    return date.format("MMMM D, Y");
  }),
  
  userHasWritten: computed('projectChallenge.currentCount', function(){
    return this.get('projectChallenge.currentCount')>0;
  })
});
