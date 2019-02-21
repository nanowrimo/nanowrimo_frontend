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
  valueChangedCallback: null,

  name: reads('property'),
  
  // Bound to the input field. Changes to 'text' upon clicking the 'eye' icon
  fieldType: 'password',
  // Bound to the eye icon. Changes to eye-slash when the password field becomes type 'text'
  iconClass: 'eye',

  actions: {
    valueChanged: function(){
      let vcc = this.get('valueChangedCallback');
      if (vcc) {
        //get the value 
        let val = this.get('changeset').get( this.get('property') );
        //perform the value changed action
        vcc(val);
      }
    },
    toggleVisible: function() {
      // If the field is of type 'password', change it to type 'text'
      if (this.get('fieldType') == 'password') {
        this.set('fieldType', 'text');
        this.set('iconClass', 'eye-slash');
      } else { // Otherwise, do the opposite
        this.set('fieldType', 'password');
        this.set('iconClass', 'eye');
      }
      // After toggling visibility, put the focus back in the password field...
      var obj = document.getElementById(this.get('property'));
      obj.focus();
      // ...and put the cursor at the end of the entered text
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
