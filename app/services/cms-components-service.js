import Service from '@ember/service';
import { computed }  from '@ember/object';
//import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  currentUser: service(),
  
  pepTalks: null,
  
  getPepTalks() {
    let endpoint =  `${ENV.APP.API_HOST}/pages/pep-talks`;
    fetch(endpoint).then((data)=>{
      data.json().then((json)=>{
        this.set('pepTalks', json);
        return 'done';
      });
    });
  },
  
  loadedPepTalks: computed('pepTalks',function() {
    return this.get('pepTalks');
  }),
  
  sponsorOffers: null,
  
  getSponsorOffers() {
    let endpoint =  `${ENV.APP.API_HOST}/pages/sponsor-offers`;
    fetch(endpoint).then((data)=>{
      data.json().then((json)=>{
        this.set('sponsorOffers', json);
        return 'done';
      });
    });
  },
  
  loadedSponsorOffers: computed('sponsorOffers',function() {
    return this.get('sponsorOffers');
  }),
  
});
