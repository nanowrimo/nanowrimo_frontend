import Component from '@ember/component';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),
  store: service(),
  
  user: null,
  primaryProject: null,
  showStopwatch: false, //default to showing the stopwatch
  timerHoursValue: 1,
  timerMinutesValue: 0,
  countdownRemaining: null,
  
  init(){
    this._super(...arguments);
    let user = this.get('currentUser.user');
    this.set('user',  user);
    this.set('primaryProject', user.primaryProject);
  },
  
  
  actions: {
    cancel: function() {
      //stop what needs stopping 
      
      //hide the forms
      let cfa = this.get('closeFormAction');
      cfa();
      //this.attrs.closeFormAction();
    },
    selectTimer: function() {
      this.set('showStopwatch', false);
    },
    selectStopwatch: function() {
      this.set('showStopwatch', true);
    },
    startTimer: function() {
      //determine the duration
      var hours = parseInt( this.get('timerHoursValue') );
      var mins = parseInt( this.get('timerMinutesValue') );
      var duration = (hours*60)+mins;
      
      //make a new timer for the user
      let now = moment();
      let t = this.store.createRecord('timer', {
        user: this.get('user'), 
        start: now.toDate(),
        duration: duration
      });

      //save the timer
      t.save();
      /* post save stuff? */
      //close the form
      let cfa = this.get('closeFormAction');
      cfa();
      
      
    },
    startStopwatch: function() {
    },
    timerSetHoursChanged: function(v) {
      this.set('timerHoursValue', v);
    },
    timerSetMinutesChanged: function(v) {
      this.set('timerMinutesValue', v);
    },
  }
  
  
});
