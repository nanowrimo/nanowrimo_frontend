import Component from '@ember/component';
import { computed }  from '@ember/object';

export default Component.extend({

  buttonLabel: null,
  isLoading: false,
  isDisabled: false,
  actionOnClick: null,
  
  loadingClass: computed('isLoading',function() {
    const isLoading = this.get('isLoading');
    if (isLoading) {
      return 'is-loading';
    } else {
      return '';
    }
  }),
  
  actions: {
    
    buttonClicked() {
      this.set('isLoading',true);
      this.set('isDisabled',true);
      let parentAction = this.get("actionOnClick");
      setTimeout(() => {  parentAction(); }, 10);
    },
  
  },
  
});
