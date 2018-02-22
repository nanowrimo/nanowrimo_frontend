import Component from '@ember/component';

export default Component.extend({
  hasAttemptedSubmit: false,

  init() {
    this._super(...arguments);
    this.get('changeset').validate();
  },

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');
      return changeset.validate()
        .then(() => {
          if (changeset.get('isValid')) {
            return changeset.save()
              .then(() => {
                this.get('submit')();
              });
          } else {
            this.set('hasAttemptedSubmit', true);
          }
        });
    }
  }
});
