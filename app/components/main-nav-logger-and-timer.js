import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  
  displaySessionForm: false,
  displayTimerForm: false,
  activeTimer: null,
  timerIsRunning: false,
  countdownRemaining: null,
  
  
  displayCountdownOnButton: computed('countdownRemaining', 'displayTimerForm', function(){
    return ( this.get('countdownRemaining') );
  }),
  
  init(){
    this._super(...arguments);
    // does the current user have an active timer?
    this.set('activeTimer', this.get('currentUser.user.activeTimer') );
    this.checkTimer();
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
    }
  },
  
  //function to check the timer and dispay if necessary 
  checkTimer: function() {
    var self = this;
    let t = this.get('activeTimer');
    if(t) {
      //there is an active timer
      this.set('timerIsRunning', true)
      //get the formattted H M S remaining
      this.set('countdownRemaining', t.HmsRemaining());
      
      
      //check the timer again in about 1 second
      later(self, function(){
        self.checkTimer();
      }, 1000);
    } else {
      //is there a runningtimer?
      if (this.get('timerIsRunning') ) {
        //timer is no longer running
        this.set('timerIsRunning', false);
        
        // do stuff because the timer has ended!
        this.set('countdownRemaining', null);
      }
    }
  }
  
});
