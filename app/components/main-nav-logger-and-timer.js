import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),

  displaySessionButton:true,
  displaySessionForm: false,
  displayTimerForm: false,
  timerIsRunning: false,
  countdownRemaining: null,
  referenceTimer: null,

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
    toggleSessionForm: function() {
      if (this.get('displaySessionForm')) {
        this.set('displaySessionForm', false);
      } else {
        this.set('displaySessionForm', true);
        this.set('displayTimerForm', false);
      }
    },
    toggleTimerForm: function() {
      if (this.get('displayTimerForm')) {
        this.set('displayTimerForm', false);
      } else {
        this.set('displayTimerForm', true);
        this.set('displaySessionForm', false);
      }
    },
    hideForms: function() {
      this.set('displaySessionForm', false);
      this.set('displayTimerForm', false);
    },
    checkTimer: function(){
      this._checkTimer();
    },
    cancelTimer: function() {
      //cancel the timer
      let t = this.get('currentUser.user.latestTimer');
      t.set('cancelled', moment().toDate());
      t.save();
      this.set('timerIsRunning', false);
      this.set('countdownRemaining', null);
    }
  },

  //function to check the timer and dispay if necessary
  _checkTimer: function() {
    var self = this;
    let t = this.get('currentUser.user.latestTimer');
    //has the timer not ended?
    if(t && !t.ended() && !t.cancelled) {
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
        //get the timer audio
        let at = document.getElementById('timer-audio');
        at.play();
        //update the reference timer
        this.set('referenceTimer', t);
        //open the logger
        this.send('toggleSessionForm');
      }
    }
  }

});
