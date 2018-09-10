import Component from '@ember/component';

export default Component.extend({
  changeset: null,
  
  actions: {
    rollbackChanges: function() {
      //rollback the changeset
      this.get('changeset').rollback();
    }
  }
});
