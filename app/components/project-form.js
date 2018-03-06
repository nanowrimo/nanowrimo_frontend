import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { Promise } from 'rsvp';

export default Component.extend({

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');

      if (isEmpty(this.get('genreError')) && changeset.get('isValid')) {
        return Promise.all(
          this.get('project.genres').filterBy('isNew').map(function(genre) {
            return genre.save();
          })
        )
        .then(() => {
          return changeset.save()
          .then(() => {
            this._callAfterSubmit();
          });
        });
      } else {
        return this.set('hasAttemptedSubmit', true);
      }
    }
  }
});
