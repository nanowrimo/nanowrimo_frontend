import Component from '@ember/component';
import { computed }  from '@ember/object';
import Group from 'nanowrimo/models/group';

const DEFAULT_TAB = 'overview';

export default Component.extend({
  tagName: '',

  tab: null,
  open: null,
  group: null,
  hasValidationError: false,
  
  optionsForJoiningRule: computed(function() {
    return Group.optionsForJoiningRule;
  }),

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
    updateChangeset() {
      //alert('updating');
    },
 
    validateName(str) {
      alert('validating');
      if ((str == "")||(str==null)) {
        alert('error');
      }
    },
    onHidden() {
      this.get('group').rollbackGroupExternalLinks();
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
