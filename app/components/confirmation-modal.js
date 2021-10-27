import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  doubleCheck: null,
  doubleCheckIsChecked: false,
  
  disableYes: computed('doubleCheck','doubleCheckIsChecked', function(){
    // is there a doubleCheck?
    let dc = this.get('doubleCheck');
    //is there a doubleCheck?
    if (dc) {
      // has the doubleCheck checkbox been checked?
      return !this.get('doubleCheckIsChecked');
    }else{
      return false;
    }
  }),
 
  actions: {
    onShow() {
      // ensure double check is false
      this.set('doubleCheckIsChecked', false);
      var t = document.getElementById("ember-bootstrap-wormhole");
      t.firstElementChild.setAttribute("aria-modal", "true");
      t.firstElementChild.setAttribute("aria-label", "confirm this action");
    },
    
    onHidden() {
      this.set('open', null);
    },

    yes() {
      let ya = this.get('yesAction');
      if (ya) {
        ya();
      }
    },
    
    no() {
      let na = this.get('noAction');
      if (na) {
        na();
      }
    },
    
    clickedDoubleCheck(val) {
      // the checkbox was clicked
      this.set('doubleCheckIsChecked', val);
    }
  }
});
