import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  post: null,
  subposts: null,
  
  // Returns html-safe background style for the plate image
  safePlateSrc: computed(function() {
    return new htmlSafe( ".nw-cms-hero { background: url('" + this.get('post.data.attributes.card-image') + "') no-repeat center center; background-size:cover; }" );
  }),
  
  // Returns true if this is a Plate
  isPlate: computed(function() {
    return this.get('post.data.attributes.content-type')=='Plate';
  }),
  
  // Returns true if this is a Plate
  isGroupOfPeople: computed(function() {
    return this.get('post.data.attributes.content-type')=='Group of people';
  }),
  
});
