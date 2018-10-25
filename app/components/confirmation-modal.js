import Component from '@ember/component';

export default Component.extend({
 
  actions: {
    onShow() {
      // do nothing
    },
    
    onHidden() {
      // do nothing
    },
    yes() {
      let ya = this.get('yesAction');
      if (ya) {
        ya();
      }
    },
    
    no() {
      let na = this.get('noAction');
      if (na) {
        na();
      }
    }
  }
});
