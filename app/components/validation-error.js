import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  property: '',

  errorMessage: computed('changeset.error', 'property', function() {
    let inputErrors = this.get(`changeset.error.${this.get('property')}`);
    return inputErrors ? inputErrors.validation[0] : null;
  }),

  showErrorMessage: computed('errorMessage', 'hasAttemptedSubmit', 'hasBlurred', function() {
    return (this.get('hasAttemptedSubmit') || this.get('hasBlurred')) && isPresent(this.get('errorMessage'));
  })
});
