import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  hasAttemptedSubmit: false,

  buttonLabel: computed('changeset.id', function() {
    return this.get('changeset.id') ? "Update Project" : "Create Project";
  }),

  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },

  init() {
    this._super(...arguments);
    this.get('changeset').validate();
  },

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');
      if (changeset.get('isValid')) {
        return changeset.save()
        .then(() => {
          this._callAfterSubmit();
        });
      } else {
        return this.set('hasAttemptedSubmit', true);
      }
    }
  }
});
