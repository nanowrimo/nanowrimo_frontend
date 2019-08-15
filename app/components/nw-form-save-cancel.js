/* nw-form-save-cancel
 * this components provides a "SAVE CHANGES" button and "Reset Form" link
 * Takes 2 parameters
 * hasChanges: a boolean representing if the form inputs have changes
 * resetCallback: a callback action that is called with 'Reset Form' is activated
 */

import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  resetCallback: null,
  hasChanges: false,
  
  noChanges: computed('hasChanges', function(){
    return !this.get("hasChanges");
  }),
  
  actions: {
    resetForm: function() {
      //if there is a callback, call it!
      let rcb = this.get('resetCallback');
      if (rcb) {
        rcb();
      }
    }
  }
});
