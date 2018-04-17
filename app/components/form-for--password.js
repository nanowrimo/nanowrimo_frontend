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
  type: 'password',

  name: reads('property'),
  
  fieldType: 'password',

  actions: {
    toggleVisible: function() {
      if (this.get('fieldType') == 'password')
        this.set('fieldType', 'text');
      else
        this.set('fieldType', 'password');
      var obj = document.getElementById("password");
      obj.focus();
      if (!(obj.updating)) {
        obj.updating = true;
        var oldValue = obj.value;
        obj.value = '';
        setTimeout(function(){ obj.value = oldValue; obj.updating = false; }, 100);
      }
    },
    makeInvisible: function() {
      this.set('fieldType', 'password');
    }
  }
  
});
