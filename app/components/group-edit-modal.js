import Component from '@ember/component';
import { computed }  from '@ember/object';
import Group from 'nanowrimo/models/group';

const DEFAULT_TAB = 'overview';

export default Component.extend({
  tagName: '',

  tab: null,
  open: null,
  group: null,
  
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
  
  validateInput() {
    // Set the group name to the input string
    let n = this.get('group.name');
    let i = this.get('group.maxMemberCount');
    let hasError = false;
    if ((n == "")||(n==null)) {
      hasError = true;
    }
    if (!(i>2 && i<21)) {
      hasError = true;
    }
    this.set('hasValidationError',hasError);
  },

  actions: {
    updateChangeset() {
      //alert('updating');
    },
 
    nameChanged(val) {
      // Set the group name to the input string
      this.set('group.name', val);
      // Validate all relevant input
      this.validateInput();
    },
    
    maxMemberCountChanged(val) {
      // Get the integer value of the field
      let i = parseInt(val);
      // Set the group name to the input string
      this.set('group.maxMemberCount', i);
      // Validate all relevant input
      this.validateInput();
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
