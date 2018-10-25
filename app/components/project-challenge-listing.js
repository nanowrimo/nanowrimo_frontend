import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  
  svg: computed('projectChallenge', function() {
    let str = (this.get('projectChallenge.unitType') === 0) ? 'writing' : 'editing';
    return `/images/goals/${str}.svg`
  }),
  
  
  actions: {
   deleteConfirmationYes(){
      
    },
    deleteConfirmationNo(){
      
    }
  }
});
