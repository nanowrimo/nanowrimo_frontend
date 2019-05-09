import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  onKeyPress: null,
  autocomplete: null,
  autofocus: false,
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  label: '',
  placeholder: null,
  property: '',
  name: reads('property'),
  
  actions: {
    keyPress: function(){
      let okp = this.get('onKeyPress');
      if(okp) { okp(); }
    }
  }
});
