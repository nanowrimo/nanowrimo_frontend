import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
//import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  cmsComponentsService: service(),
  post: null,
  currentUrl: null,
  subposts: null,
  sponsor: null,
  description: null,
  imageUrl: null,
  offer: null,
  offerCode: null,
  offerJson: null,
  init() {
    this._super(...arguments);
  },
  
  sponsorComputed: computed('sponsor',function() {
    return this.get('sponsor');
  }),
  
  descriptionComputed: computed('description',function() {
    return this.get('description');
  }),
  
  imageUrlComputed: computed('imageUrl',function() {
    return this.get('imageUrl');
  }),
  
  offerCodeComputed: computed('offerCode',function() {
    return this.get('offerCode');
  }),
  
  // Returns html-safe background style for the plate image
  safePlateSrc: computed(function() {
    return new htmlSafe( ".nw-cms-hero { background: url('" + this.get('post.data.attributes.card-image') + "') no-repeat center center; background-size:cover; }" );
  }),
  
  // Returns true if this is a Plate
  isPlate: computed(function() {
    return this.get('post.data.attributes.content-type')=='Plate';
  }),
  
  // Returns true if this is a group of people
  isGroupOfPeople: computed(function() {
    return this.get('post.data.attributes.content-type')=='Group of people';
  }),
  
  // Returns true if this is a group of page cards
  isGroupOfPageCards: computed(function() {
    return this.get('post.data.attributes.content-type')=='Group of page cards';
  }),
  
  // Returns true if this is an Ember component
  isComponent: computed(function() {
    return this.get('post.data.attributes.content-type')=='API code';
  }),
  
  // Returns true if this is an Ember component
  isDynamicSponsorOffer: computed(function() {
    this.setDynamicData();
    return this.get('post.data.attributes.content-type')=='Dynamic sponsor offer';
  }),
  
  // Returns true if this is a group of page cards
  isGeneralContent: computed(function() {
    return this.get('post.data.attributes.content-type')=='General content';
  }),
  
  setDynamicData() {
    this.set('post.data.attributes.className',"flex-large");
    this.set('post.data.attributes.order',1);
  },
  
});
