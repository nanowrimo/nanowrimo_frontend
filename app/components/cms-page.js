import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  
  // page is passed into the component
  page: null,
  
    didInsertElement: function(model){
    Ember.run.scheduleOnce('afterRender', this, function(model) {
      let cliList = CwiList.create();
    });
  },
  
  // Returns the publication date as a readable string
  computeShowAfter: computed(function() {
    return moment(this.get('page.data.attributes.show-after')).format("MMMM D, YYYY");
  }),
  
  // Returns true if this is a Pep Talk
  isPepTalk: computed(function() {
    return this.get('page.data.attributes.content-type')=='Pep Talk';
  }),
  
  // Returns true if this is a posts collection
  isPlainText: computed(function() {
    return this.get('page.data.attributes.content-type')=='Plain Text'
  }),
  
  // Returns true if this is a posts collection
  isStackedContent: computed(function() {
    return this.get('page.data.attributes.content-type')=='Stacked Content'
  }),
  
});
