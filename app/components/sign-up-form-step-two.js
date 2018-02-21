import Component from '@ember/component';

export default Component.extend({
  hasAttemptedSubmit: false,

  actions: {
    validateAndSubmit() {
      this.get('changeset').validate()
        .then(() => {
          if (this.get('changeset.isValid')) {
            this.get('submit')();
          } else {
            this.set('hasAttemptedSubmit', true);
          }
        });
    }
  }
});
