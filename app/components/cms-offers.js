import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  
  cmsComponentsService: service(),
  
  init() {
    this._super(...arguments);
    
    let ccs = this.get('cmsComponentsService');
    ccs.getSponsorOffers();
  },
  
  
  cmsOfferPromos: computed('cmsComponentsService.sponosorOffers', function() {
    //return 'hello';
    let ccs = this.get('cmsComponentsService');
    //ccs.getPepTalks();
    return ccs.sponsorOffers;
  }),
  
});
