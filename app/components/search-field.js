import Component from '@ember/component';
import { computed } from '@ember/object';
//import { alias } from '@ember/object/computed';

export default Component.extend({
  size: 'small',
  q: '',
  tempSearchString: '',
  
  // Returns the class to resize the input field
  sizeClass: computed('size', function() {
    return 'nw-search-' + this.get('size');
  }),

  actions: {
  }
  
  
});
