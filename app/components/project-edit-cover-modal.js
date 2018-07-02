import Component from '@ember/component';
import { computed }  from '@ember/object';

const DEFAULT_TAB = 'coverTab';

export default Component.extend({
  tagName: '',

  tab: null,
  open: null,
  project: null,

  activeTab: computed('tab', {
    get() {
      return this.get('tab') || DEFAULT_TAB;
    },
    set(key, value) {
      if (value === DEFAULT_TAB) {
        this.set('tab', null);
      } else {
        this.set('tab', value);
      }
      return value;
    }
  }),

  actions: {
    onHidden() {
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
