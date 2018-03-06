import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  modelErrors: null,
  property: '',

  errorMessage: computed('changeset.error', 'modelErrors', 'property', function() {
    let modelErrors = this.get('modelErrors');
    let property = this.get('property');
    if (modelErrors) {
      return get(modelErrors, property);
    } else {
      let changesetErrors = this.get(`changeset.error.${property}`);
      return changesetErrors ? changesetErrors.validation[0] : null;
    }
  }),

  showErrorMessage: computed('errorMessage', 'hasAttemptedSubmit', 'hasBlurred', function() {
    return (this.get('hasAttemptedSubmit') || this.get('hasBlurred')) && isPresent(this.get('errorMessage'));
  })
});
