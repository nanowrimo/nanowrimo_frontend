import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default Component.extend({
  
  cmsComponentsService: service(),
  classNames: ['nw-flex-6-cols'],
  init() {
    this._super(...arguments);
    
    let ccs = this.get('cmsComponentsService');
    ccs.getSponsorOffers();
  },
  
  
  cmsOfferPromos: computed('cmsComponentsService.recomputeOffers', function() {
    //return 'hello';
    let ccs = this.get('cmsComponentsService');
    if (ccs.sponsorOffers) {
      let first = [];
      let second = [];
      ccs.sponsorOffers.forEach(function(offer) {
        if (offer.data.attributes.order==1) {
          offer.data.attributes.className = "flex-medium";
          first.push(offer.data.attributes);
        }
        if (offer.data.attributes.order==2) {
          offer.data.attributes.className = "flex-small";
          second.push(offer.data.attributes);
        }
      });
      let rand1 = shuffle(first);
      let rand2 = shuffle(second);
      // Change the class name of the first one or two to 'flex-large'
      if (rand1.length>0) {
        rand1[0].className = "flex-large";
        if (rand1.length%2==0) {
          rand1[1].className = "flex-large";
        }
      }
      let sorted = rand1.concat(rand2);
      return sorted;
    } else {
      return [];
    }
  }),
  
  cmsThirdOfferPromos: computed('cmsComponentsService.recomputeOffers', function() {
    //return 'hello';
    let ccs = this.get('cmsComponentsService');
    if (ccs.sponsorOffers) {
      let third = [];
      ccs.sponsorOffers.forEach(function(offer) {
        if (offer.data.attributes.order==3) {
          offer.data.attributes.className = "flex-tiny";
          third.push(offer.data.attributes);
        }
      });
      let sorted = shuffle(third);
      return sorted;
    } else {
      return [];
    }
  }),
});
