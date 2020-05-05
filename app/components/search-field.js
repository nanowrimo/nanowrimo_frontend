import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  router: service(),
  searchService: service(),
  size: 'small',
  q: alias('searchService.q'),
  tempSearchString: '',
  
  // Returns the class to resize the input field
  sizeClass: computed('size', function() {
    return 'nw-search-' + this.get('size');
  }),

  actions: {
    searchSubmit() {
      //get the query value
      let qValue = event.target.q.value;
      //set the search service q
      this.set('searchService.q', qValue);
      let router = this.get('router');
      router.transitionTo('authenticated.search',{ queryParams: { q: qValue}});
      return false;
    }
  }
  
  
});
