import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),

  displaySessionForm: false,
  displayTimerForm: false,
  timerIsRunning: false,
  stopwatchRunning: false,
  timeProgress: null,
  referenceStart: null,
  referenceEnd: null,
  activeProjectChallenge: null,
    
  displaySessionButton: computed('displayTimeOnButton', function(){
    return !this.get('displayTimeOnButton');
  }),

  displayTimeOnButton: computed('timeProgress', function(){
    return ( this.get('timeProgress') );
  }),

  primaryProject: computed("currentUser.user.primaryProject", function(){
    let p = this.get('currentUser.user.primaryProject');
    if (p) {
      p.activeProjectChallenge.then((data)=>{
        this.set('activeProjectChallenge', data);
      });
      return p;
    }
  }),

  init(){
    this._super(...arguments);
    // does the current user have an active timer?
    this._checkTimer();
    this._checkStopwatch();
    //this will perform the check for an activeProjectChallenge
    this.get('primaryProject');
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
      //is there a stopwatch running?
      if (this.get('stopwatchRunning')){
        //end the stopwatch
        let s = this.get('currentUser.user.latestStopwatch');
        s.set('stop', moment().toDate());
        s.save();
        this.set('referenceStart', s.get('start'));
        this.set('referenceEnd', s.get('stop'));
        return;
      }
      if (this.get('timerIsRunning') ) {
        let t = this.get('currentUser.user.latestTimer');
        
        //timer is no longer running
        this.set('timerIsRunning', false);

        // do stuff because the timer has ended!
        this.set('timeProgress', null);
        //get the timer audio
        //let at = document.getElementById('timer-audio');
        //at.play();
        //update the reference timer
        t.set('end', moment().toDate());
        this.set('referenceStart', t.get('start'));
        this.set('referenceEnd', t.get('end'));
        //open the logger
        this.send('toggleSessionForm');
        t.set('cancelled', moment().toDate());
        t.save();
        this.set('timerIsRunning', false);
        this.set('timeProgress', null);
        
        return;
      }
      
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
    checkStopwatch: function(){
      this._checkStopwatch();
    },
    cancelTimer: function() {
      //cancel the timer
      let t = this.get('currentUser.user.latestTimer');
      t.set('cancelled', moment().toDate());
      t.save();
      this.set('timerIsRunning', false);
      this.set('timeProgress', null);
    }
  },
  //function to check the stopwatch and display if necessary
  _checkStopwatch: function() {
    var self = this;
    let s = this.get('currentUser.user.latestStopwatch');
    if (s && s.stop==null){
      // stopwatch has not ended
      this.set('stopwatchRunning',true);
      this.set('timeProgress', s.HmsCount());
      if (s.tenMinuteIncrement) {
        //make a nois
        document.getElementById('stopwatch-audio').play();
      }
      //check again in about a second
      later(self, function(){
        self._checkStopwatch();
      }, 1000);
    } else {
      if(this.get('stopwatchRunning')){
        this.set('stopwatchRunning', false);
        // do stuff because the timer has ended!
        this.set('timeProgress', null);
        //open the logger
        this.send('toggleSessionForm');
      }
    }
  },
  //function to check the timer and display if necessary
  _checkTimer: function() {
    var self = this;
    let t = this.get('currentUser.user.latestTimer');
    //has the timer not ended?
    if(t && !t.ended() && !t.cancelled) {
      //there is an active timer
      this.set('timerIsRunning', true)
      //get the formattted H M S remaining
      this.set('timeProgress', t.HmsRemaining());
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
        this.set('timeProgress', null);
        //get the timer audio
        let at = document.getElementById('timer-audio');
        at.play();
        //update the reference timer
        this.set('referenceStart', t.get('start'));
        this.set('referenceEnd', t.get('end'));
        //open the logger
        this.send('toggleSessionForm');
      }
    }
  }

});
