import Component from '@ember/component';

export default Component.extend({
  hasAttemptedSubmit: false,

  init() {
    this._super(...arguments);
    this.get('changeset').validate();
  },

  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');
      changeset.validate()
      .then(() => {
        if (changeset.get('isValid')) {
          return changeset.save()
            .then(() => {
              this._callAfterSubmit();
            });
        } else {
          this.set('hasAttemptedSubmit', true);
        }
      });
    }
  }
});
