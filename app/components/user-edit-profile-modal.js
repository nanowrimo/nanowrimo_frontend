import Component from '@ember/component';

export default Component.extend({
  tagName: '',

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
