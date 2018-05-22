import Component from '@ember/component';
import { computed }  from '@ember/object';

export default Component.extend({
  tagName: '',

  tab: null,
  open: false,
  user: null,

  activeTab: computed('tab', {
    get() {
      return this.get('tab') || 'overview';
    },
    set(key, value) {
      if (value === 'overview') {
        this.set('tab', null);
      } else {
        this.set('tab', value);
      }
      return value;
    }
  }),

  actions: {
    onHidden() {
      this.get('user').rollbackExternalLinks();
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
