import NwFlippyCard from 'nanowrimo/components/nw-flippy-card';

export default NwFlippyCard.extend({
  post: null,
  safeSrc: Ember.computed('post.attributes.card-image', function() {
    return new Ember.String.htmlSafe( "background-image: url(" + this.get('post.attributes.card-image') + ")" );
  })
    
});
