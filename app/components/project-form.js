import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { Promise } from 'rsvp';

export default Component.extend({
  hasAttemptedSubmit: false,

  project: null,

  buttonLabel: computed('changeset.id', function() {
    return this.get('changeset.id') ? "Update Project" : "Create Project";
  }),

  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },

  genreError: computed('project.genres.[]', function() {
    return isEmpty(this.get('project.genres')) ? 'Must select at least one genre' : null;
  }),

  init() {
    this._super(...arguments);
    assert('Must pass a changeset into {{project-form}}', this.get('changeset'));
    this.get('changeset').validate();
  },

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
