import Component from '@ember/component';

export default Component.extend({
  closeAction: null,
  badge: null,
  actions: {
    closeClicked(){
      let ca = this.get('closeAction');
      if (ca) {ca()}
    }
  }
});
