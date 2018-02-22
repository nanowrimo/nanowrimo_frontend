import Component from '@ember/component';

export default Component.extend({
  hasAttemptedSubmit: false,

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');
      changeset.validate()
        .then(() => {
          if (changeset.get('isValid')) {
            changeset.save().then(() => {
              this.get('submit')();
            });
          } else {
            this.set('hasAttemptedSubmit', true);
          }
        });
    }
  }
});
