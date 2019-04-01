import Component from '@ember/component';
//import { computed } from '@ember/object';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  options: null,
  property: null,
  
  actions: {
    clicked(val) {
      this.get('changeset').set(this.get('property'), val);
    }
  },
});
