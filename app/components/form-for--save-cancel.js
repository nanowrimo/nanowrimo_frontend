import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  changeset: null,
  
  isPristine: computed("changeset.isPristine", function() {
    let pristine = this.get('changeset').get('isPristine');
    return pristine;
  }),
  
  actions: {
    rollbackChanges: function() {
      //rollback the changeset
      let cs = this.get('changeset');
      this.get('changeset').rollback();
    }
  }
});
