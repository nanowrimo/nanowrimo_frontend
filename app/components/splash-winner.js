import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  step: 0,
  
  closeAction: null,
  badge: null,
  actions: {
    closeClicked(){
      let ca = this.get('closeAction');
      if (ca) {ca()}
    },
    goToStats(){
      this.send('closeClicked');
      this.get('router').transitionTo('authenticated.stats')
    },
    incrementStep(){
      this.incrementProperty("step");
    },
    decrementStep(){
      this.decrementProperty("step");
    }
  }
});
