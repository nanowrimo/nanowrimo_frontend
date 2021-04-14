import NwFlippyCard from 'nanowrimo/components/nw-flippy-card';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default NwFlippyCard.extend({
  post: null,
  safeSrc: computed('post.attributes.card-image', function() {
    return new htmlSafe( "background-image: url(" + this.get('post.attributes.card-image') + ")" );
  }),
  ariaHiddenBack: computed("nw-flipped", function() {
      return (this.get('nw-flipped')) ? "false" : "true";
  }),
  ariaHiddenFront: computed("nw-flipped", function() {
      return (this.get('nw-flipped')) ? "true" : "false";
  }),
  frontToggleStyle: computed("nw-flipped", function() {
    return (this.get('nw-flipped')) ? "display:none;" : "";
  }),
  backToggleStyle: computed("nw-flipped", function() {
    return (this.get('nw-flipped')) ? "" : "display:none;" ;
  }),
    imgSrc: computed('post.attributes.card-image', function() {
    return new htmlSafe( this.get('post.attributes.card-image') );
  })
});
