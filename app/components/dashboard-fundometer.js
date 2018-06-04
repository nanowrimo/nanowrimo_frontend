import Component from '@ember/component';
import { get,computed } from '@ember/object';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  fundometer: computed('store',function() {
    let fundometer = this.get('store').peekRecord('fundometer', 1);
    return fundometer;
  }),
  stack_height: 139,
  goal_number: computed('fundometer.goalNumber',function() {
    return this.get('fundometer.goalNumber');
  }),
  raised_number: computed('fundometer.raisedNumber',function() {
    return this.get('fundometer.raisedNumber');
  }),
  donor_number: computed('fundometer.donorNumber',function() {
    return this.get('fundometer.donorNumber');
  }),
  goal_string: computed('goal_number', function() {
    let goal_num = get(this,'goal_number');
    if (goal_num>=1000000) {
      return (goal_num/1000000).toFixed(1) + " million";
    } else {
      return (goal_num/1000).toFixed(0) + "K";
    }
  }),
  raised_string: computed('raised_number', function() {
    let raised_num = Math.floor(get(this,'raised_number'));
    return ('$' + raised_num.toLocaleString()).htmlSafe();
  }),
  donor_string: computed('donor_number', function() {
    let donor_num = get(this,'donor_number');
    var s_string = "s";
    if (donor_num==1) s_string="";
    return (donor_num.toLocaleString() + " donor" + s_string).htmlSafe();
  }),
  stack_style: computed('raised_number', function() {
    let raised_num = get(this,'raised_number');
    let goal_num = get(this,'goal_number');
    let stack_num = get(this,'stack_height');
    var total = stack_num - Math.floor(stack_num*raised_num/goal_num);
    if (total < 0) total = 0;
    return ("clip: rect(" + total + "px,130px,139px,0px)").htmlSafe();
  })
});