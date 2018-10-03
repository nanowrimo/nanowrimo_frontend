import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import  moment from 'moment';

export default DS.Model.extend({
  start: attr('date'),
  duration: attr('number'),
  cancelled: attr('boolean'),
  user: belongsTo('user'),

  end: computed('start','duration', function() {
    let s = this.get('start');
    let d = this.get('duration');
    let m = moment(s);
    m.add(d, 'minutes');
    return m.toDate();
  }),

  ended: function() {
    let now = moment();
    let end = moment(this.get('end'));
    return end.isBefore(now);
  },

  HmsRemaining: function() {
    let end = moment(this.get('end'));
    let now = moment();
    if (now.isBefore(end)) {
      let formatted='';
      let dur =  moment.duration(end.diff(now));
      let fh = dur.hours();
      if ( fh > 0 && fh < 10 ) { fh = "0"+fh}
      if(fh){
        formatted = `${fh}:`
      }
      let fm = dur.minutes();
      if ( fm < 10 ) { fm = "0"+fm}
      let fs = dur.seconds();
      if ( fs < 10 ) { fs = "0"+fs}
      formatted = `${formatted}${fm}:${fs}`;
      return formatted;
    } else {
      return null;
    }
  }

});
