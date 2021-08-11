import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  init(){
    this._super(...arguments);
  },
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
  })
  
});
