import Component from '@ember/component';

export default Component.extend({
  
  // page is passed into the component
  page: null,
    
  // Returns the publication date as a readable string
  computeShowAfter: Ember.computed(function() {
    return moment(this.get('page.data.attributes.show-after')).format("MMMM D, YYYY");
  }),
  
  // Returns true if this is a Pep Talk
  isPepTalk: Ember.computed(function() {
    return this.get('page.data.attributes.content-type')=='Pep Talk';
  }),
  
  // Returns true if this is a posts collection
  isPlainText: Ember.computed(function() {
    return this.get('page.data.attributes.content-type')=='Plain Text'
  }),
  
  // Returns true if this is a posts collection
  isStackedContent: Ember.computed(function() {
    return this.get('page.data.attributes.content-type')=='Stacked Content'
  }),
  
});
