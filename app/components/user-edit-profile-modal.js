import Component from '@ember/component';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  tagName: '',

  modalBackdropTransitionDuration: ENV.APP.MODAL_BACKGROUND_TRANSITION_MS,
  modalTransitionDuration: ENV.APP.MODAL_TRANSITION_MS,
  open: false,
  user: null,

  actions: {
    onHidden() {
      this.get('user').rollbackExternalLinks();
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', false);
      }
    }
  }
});
