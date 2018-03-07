import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  relationshipErrors: null,
  property: '',

  errorMessage: computed('changeset.error', 'property', 'relationshipErrors', function() {
    let relationshipErrors = this.get('relationshipErrors');
    let property = this.get('property');
    if (relationshipErrors) {
      return get(relationshipErrors, property);
    } else {
      let changesetErrors = this.get(`changeset.error.${property}`);
      return changesetErrors ? changesetErrors.validation[0] : null;
    }
  }),

  showErrorMessage: computed('errorMessage', 'hasAttemptedSubmit', 'hasBlurred', function() {
    return (this.get('hasAttemptedSubmit') || this.get('hasBlurred')) && isPresent(this.get('errorMessage'));
  })
});
