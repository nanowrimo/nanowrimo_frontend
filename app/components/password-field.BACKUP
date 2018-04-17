import Component from '@ember/component';

export default Component.extend({
  
  fieldType: 'password',

  actions: {
    toggleVisible: function() {
      if (this.get('fieldType') == 'password')
        this.set('fieldType', 'text');
      else
        this.set('fieldType', 'password');
    },
    makeInvisible: function() {
      this.set('fieldType', 'password');
    }
  }
  
});
