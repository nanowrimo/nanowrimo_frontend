import Component from '@ember/component';
import { computed } from '@ember/object';

const { computed: { alias }, observer } = Ember

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
