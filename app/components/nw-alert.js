import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dismissable: "",
  isDismissed: false,
  
  init(){
    this._super(...arguments);
  },
  showClose: computed('dismissable', function(){
    let dismissable = this.get('dismissable');
    return dismissable==="true";
  }),
  typeIcon: computed ('alertType', function(){
    // icon is based on alertType
    switch(this.get('alertType')){
      case "error":
      case "warning":
        return "fa-exclamation-circle";
      case "info":
        return "fa-info-circle";
      case "success":   
        return "fa-check-circle";
    }
  }),
  
  actions: {
    dismiss() {
      let action = this.get('dismissAction');
      action();
      //this.set('isDismissed',true);
    }
  }
});
