import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  autocomplete: null,
  autofocus: false,
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  label: '',
  placeholder: null,
  property: '',
  type: 'checkbox',

  name: reads('property')
});
