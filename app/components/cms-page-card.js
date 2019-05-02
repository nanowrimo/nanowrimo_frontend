import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';


export default Component.extend({
  page: null,
  currentUrl: null,
  
  safeSrc: computed('page.attributes.promotional-card-image', function() {
    return new htmlSafe( "background-image: url(" + this.get('page.attributes.promotional-card-image') + ")" );
  }),
  
  showCard: computed(function() {
    return (this.get('currentUrl') != this.get('page.attributes.url'));
  }),
  
  // Returns the publication date as a readable string
  computeShowAfter: computed(function() {
    return moment(this.get('page.attributes.show-after')).format("MMMM D, YYYY");
  }),
  
  
});
