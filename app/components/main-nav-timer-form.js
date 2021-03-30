import Component from '@ember/component';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { computed } from '@ember/object';

const DEFAULT_TAB = 'timer-modal-stopwatch';

export default Component.extend({
  currentUser: service(),
  store: service(),
  progressUpdaterService: service(),
  tab: null,
  closeFormAction: null,
  user: null,
  primaryProject: null,
  showStopwatch: false, //default to showing the stopwatch
  timerHoursValue: 1,
  timerMinutesValue: 0,
  countdownRemaining: null,
  validDurationInput: true,
  timerDuration: null,
  open: true,

  init(){
    this._super(...arguments);
    let user = this.get('currentUser.user');
    this.set('user',  user);
    this.set('primaryProject', user.primaryProject);
  },
  
  activeTab: computed('tab', {
    get() {
      return this.get('tab') || DEFAULT_TAB;
    },
    set(key, value) {
      if (value === DEFAULT_TAB) {
        this.set('tab', null);
      } else {
        this.set('tab', value);
      }
      return value;
    }
  }),

  actions: {
    
    onShow() {
    },
    
    onHidden() {
    },
    
    cancel: function() {
      //stop what needs stopping

      //hide the forms
      let cfa = this.get('closeFormAction');
      cfa();
      //this.attrs.closeFormAction();
    },
    /*
    selectTimer: function() {
      this.set('showStopwatch', false);
    },
    selectStopwatch: function() {
      this.set('showStopwatch', true);
    },
     */
    startTimer: function() {
      if (this.get('validDurationInput')) {
        //determine the duration
        var hours = parseInt( this.get('timerHoursValue') );
        var mins = parseInt( this.get('timerMinutesValue') );
        var duration = (hours*60)+mins;

        //make a new timer for the user
        let now = moment();
        let t = this.store.createRecord('timer', {
          user: this.get('user'),
          start: now.toDate(),
          duration: duration  //this.get('timerDuration')
        });

        //save the timer
        t.save();
        /* post save stuff? */
        //close the form
        let cfa = this.get('closeFormAction');
        cfa();
        //do the afterNewTimer stuff
        let ant = this.get('afterNewTimer');
        ant();
      }
    },
    durationChange: function(v) {
      //validate and parse the input value
      let trimmed = v.replace(/[^0-9.:]/g, '');
      //if the trimmed value contains a . and a :, the input is invalid
      if ((trimmed.includes(".") && trimmed.includes(":")) || trimmed.length < 1 ) {
        this.set('validDurationInput', true);
      } else {
        // does the input have a ":"?
        if(trimmed.includes(":")){
          //split at ":"
          var bits = trimmed.split(":");
          let hours = parseInt(bits[0] || 0);
          let minutes = parseInt(bits[1]);
          this.set('timerDuration', (hours*60)+minutes);
          this.set('validDurationInput', true);
        } else {
          // If there's a decimal point
          if(trimmed.includes(".")) {
            let hours = parseFloat(trimmed);
            let minutes = parseInt(hours*60);
            this.set('timerDuration', minutes);
            this.set('validDurationInput', true);
          } else {
            // If the value is just an integer
            let count = parseInt(trimmed);
            if (count<15) {
              let hours = parseInt(trimmed);
              let minutes = parseInt(hours*60);
              this.set('timerDuration', minutes);
              this.set('validDurationInput', true);
            } else {
              let minutes = parseInt(trimmed);
              this.set('timerDuration', minutes);
              this.set('validDurationInput', true);

            }
          }
        }
      }
    },
    startStopwatch: function() {
     //make a new stopwatch for the user
      let now = moment();
      let s = this.store.createRecord('stopwatch', {
        user: this.get('user'),
        start: now.toDate()
      });

      //save the timer
      s.save();
      /* post save stuff? */
      let ans =this.get('afterNewStopwatch');
      ans();
      //close the form
      let cfa = this.get('closeFormAction');
      cfa();
    },

    timerSetHoursChanged: function(v) {
      this.set('timerHoursValue', v);
      this.set('timerDuration', this.get('timerHoursValue')*60 + this.get('timerMinutesValue'));
      this.set('validDurationInput', true);
    },
    timerSetMinutesChanged: function(v) {
      this.set('timerMinutesValue', v);
      this.set('timerDuration', this.get('timerHoursValue')*60 + this.get('timerMinutesValue'));
      this.set('validDurationInput', true);
    },
    cancelTimer: function(){
     let cta = this.get('cancelTimerAction');
     cta();
    }
  }
});
