import Component from '@ember/component';
import { computed } from '@ember/object';
//import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default Component.extend({
  
  cmsComponentsService: service(),
  
  load() {
    let ccs = this.get('cmsComponentsService');
    ccs.getPepTalks();
  },
  
  
  cmsPagePromos: computed('cmsComponentsService.pepTalks', function() {
    //return 'hello';
    let ccs = this.get('cmsComponentsService');
    //ccs.getPepTalks();
    return ccs.pepTalks;
  }),
  
});
