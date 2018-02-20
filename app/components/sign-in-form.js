import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  hasAttemptedSubmit: false,

  actions: {
    validateAndSubmit() {
      this.get('changeset').validate()
        .then(() => {
          if (isEmpty(this.get('changeset.errors'))) {
            this.get('submit')();
          } else {
            this.set('hasAttemptedSubmit', true);
          }
        });
    }
  }
});
