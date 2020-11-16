import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  relationshipErrors: null,
  property: '',
  forcedError:null,

  errorMessage: computed('forcedError','changeset.error', 'property', 'relationshipErrors', function() {
    let forced = this.get('forcedError');
    if (forced) {
      return forced;
    }
    let relationshipErrors = this.get('relationshipErrors');
    let property = this.get('property');
    if (relationshipErrors) {
      return get(relationshipErrors, property);
    } else {
      let changesetErrors = this.get(`changeset.error.${property}`);
      return changesetErrors ? changesetErrors.validation[0] : null;
    }
  }),

  showErrorMessage: computed('forcedError', 'errorMessage', 'hasAttemptedSubmit', 'hasBlurred', function() {
    if (this.get('forcedError')!=null){
      return true;
    }
    //return (this.get('hasAttemptedSubmit') || this.get('hasBlurred')) && isPresent(this.get('errorMessage'));
    return (this.get('hasAttemptedSubmit')) && isPresent(this.get('errorMessage'));
  })
});
