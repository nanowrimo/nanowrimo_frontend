import Component from '@ember/component';

export default Component.extend({
  post: null,
  subposts: null,
  
  // Returns html-safe background style for the plate image
  safePlateSrc: Ember.computed(function() {
    return new Ember.String.htmlSafe( ".nw-cms-hero { background: url('" + this.get('post.data.attributes.card-image') + "') no-repeat center center; background-size:cover; }" );
  }),
  
  // Returns true if this is a Plate
  isPlate: Ember.computed(function() {
    return this.get('post.data.attributes.content-type')=='Plate';
  }),
  
  // Returns true if this is a Plate
  isGroupOfPeople: Ember.computed(function() {
    return this.get('post.data.attributes.content-type')=='Group of people';
  }),
  
});
