import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import  moment from 'moment';

export default DS.Model.extend({
  start: attr('date'),
  stop: attr('date'),
  user: belongsTo('user'),

  hours: null,
  minutes: null,
  seconds: null,

  tenMinuteIncrement: computed('minutes','seconds', function(){
    let m = this.get('minutes');
    let s = this.get('seconds');
    if (s==0 && m>0 && m%10==0){
      return true;
    } else {
      return false;
    }
  }),

  HmsCount: function() {
    //has the stopwatch ended?
    if (this.get('end')){
      return null;
    }
    let start = moment(this.get('start'));
    let now = moment();
    let formatted='';
    let dur =  moment.duration(now.diff(start));
    let fh = dur.hours();
    if(fh!==0){
      formatted = `${fh}:`
      this.set('hours', fh);
    }
    let fm = dur.minutes();
    if (fh || fm) {
      if ( fm < 10 ) { fm = "0"+fm}
      formatted = `${formatted}${fm}:`;
      this.set('minutes', fm);
    }

    let fs = dur.seconds();
    this.set('seconds', fs);
    if (fm && fs < 10 ) { fs = "0"+fs}
    formatted = `${formatted}${fs}`;
    return formatted;
  }

});
