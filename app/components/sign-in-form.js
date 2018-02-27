import Component from '@ember/component';

export default Component.extend({
  hasAttemptedSubmit: false,

  init() {
    this._super(...arguments);
    this.get('changeset').validate();
  },

  _callAfterError(error) {
    let callback = this.get('afterError');
    if (callback) { callback(error); }
  },

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');
      if (changeset.get('isValid')) {
        return changeset.save()
        .catch((error) => {
          this._callAfterError(error);
        });
      } else {
        return this.set('hasAttemptedSubmit', true);
      }
    }
  }
});
