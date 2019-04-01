import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  changeset: null,
  resetCallback: null,
  isPristine: computed("changeset.isPristine", function() {
    let pristine = this.get('changeset').get('isPristine');
    return pristine;
  }),
  
  actions: {
    rollbackChanges: function() {
      //rollback the changeset
      this.get('changeset').rollback();
      let rcb = this.get('resetCallback');
      if (rcb) {
        rcb();
      }
    }
  }
});
