import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  
  displaySessionForm: false,
  displayTimerForm: false,
  timerIsRunning: false,
  countdownRemaining: null,
  
  displayCountdownOnButton: computed('countdownRemaining', function(){
    return ( this.get('countdownRemaining') );
  }),
  
  
  init(){
    this._super(...arguments);
    // does the current user have an active timer?
    this.set('latestTimer', this.get('currentUser.user.latestTimer') );
    this._checkTimer();
  },
  
  actions: {
    showSessionForm: function() {
      this.set('displaySessionForm', true);
      this.set('displayTimerForm', false);
    },
    showTimerForm: function() {
      this.set('displayTimerForm', true);
      this.set('displaySessionForm', false);
    },
    hideForms: function() {
      this.set('displaySessionForm', false);
      this.set('displayTimerForm', false);
    },
    checkTimer: function(){
      this._checkTimer();
    }
  },
  
  //function to check the timer and dispay if necessary 
  _checkTimer: function() {
    var self = this;
    let t = this.get('currentUser.user.latestTimer');
    //has the timer not ended?
    if(t && !t.ended()) {
      //there is an active timer
      this.set('timerIsRunning', true)
      //get the formattted H M S remaining
      this.set('countdownRemaining', t.HmsRemaining());
      //check the timer again in about 1 second
      later(self, function(){
        self._checkTimer();
      }, 1000);
    } else {
      //is there a runningtimer?
      if (this.get('timerIsRunning') ) {
        //timer is no longer running
        this.set('timerIsRunning', false);
        
        // do stuff because the timer has ended!
        this.set('countdownRemaining', null);
        //console.log('beep!');
      }
    }
  }
  
});
