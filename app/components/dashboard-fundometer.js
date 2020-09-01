import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';
//import fetch from 'fetch';

export default Component.extend({

  stack_height: 139,
  goal: null,
  raised: null,
  donorCount: null,
  init(){
    this._super(...arguments);
    //start getting data
    this.getFundometerData(this);
    //refresh the fundometer data ever 15 minutes
    //let milliseconds = 15*60*1000;
    //setInterval(this.getFundometerData, milliseconds, this);
  },

  goal_string: computed('goal', function() {
    let goal = this.get('goal');
    if (goal>=1000000) {
      return (goal/1000000).toFixed(1) + " million";
    } else {
      return (goal/1000).toFixed(0) + "K";
    }
  }),
  
  raised_string: computed('raised', function() {
    let raised = Math.floor(this.get('raised'));
    return ('$' + raised.toLocaleString()).htmlSafe();
  }),
  
  donor_string: computed('donorCount', function() {
    let donor  = this.get('donorCount');
    if (donor) {
      return (donor.toLocaleString() + " donors" ).htmlSafe();
    }
    return null;
  }),
  
  stack_style: computed('raised', function() {
    let raised  = this.get('raised');
    let goal  = this.get('goal');
    let stack  = this.get('stack_height');
    var total = stack  - Math.floor(stack *raised /goal );
    if (total < 0) total = 0;
    return ("clip: rect(" + total + "px,130px,139px,0px)").htmlSafe();
  }),
  
  
  getFundometerData: function(_this){
    // "_this" is the "this" that represents this component
    let endpoint = `${ENV.APP.API_HOST}/fundometer`;
    return fetch(endpoint).then((response)=>{
      return response.json().then((json)=>{
         _this.set('goal', json.goal);
         _this.set('raised', json.raised);
         _this.set('donorCount', json.donorCount);
      });
    });
  }
});
