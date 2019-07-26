import Component from '@ember/component';

export default Component.extend({
  errorMessage:null,
  name: null,
  // Bound to the input field. Changes to 'text' upon clicking the 'eye' icon
  fieldType: 'password',
  // Bound to the eye icon. Changes to eye-slash when the password field becomes type 'text'
  iconClass: 'eye',

  init(){
    this._super(...arguments);
    //was a name passed in?
    let name = this.get('name');
    if (name===null) { // if no name set
      this.set('name', 'password'); //default to 'password'
    }
  },

  actions: {

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
      var obj = document.getElementById(this.get('name'));
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
