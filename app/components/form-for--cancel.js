import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  changeset: null,
  
  actions: {
    rollbackChanges: function() {
      //rollback the changeset
      this.get('changeset').rollback();
    }
  }
});
