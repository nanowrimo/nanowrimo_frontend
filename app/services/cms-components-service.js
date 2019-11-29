import Service from '@ember/service';
import { computed }  from '@ember/object';
//import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';

export default Service.extend({
  session: service(),
  currentUser: service(),
  recomputeOffers: 0,
  
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
  
  incrementRecomputeOffers() {
    let rb  = this.get('recomputeOffers')+1;
    this.set('recomputeOffers',rb);
  },
  
  loadedPepTalks: computed('pepTalks',function() {
    return this.get('pepTalks');
  }),
  
  getSponsorOffers () {
    let endpoint =  `${ENV.APP.API_HOST}/offers`;
    let t = this;
    fetch(endpoint).then((data)=>{
      data.json().then((json)=>{
        t.set('sponsorOffers', json);
        t.incrementRecomputeOffers();
        return 'done';
      });
    });
  },
  
  /*getDynamicSponsorOffer(offerCode) {
    let endpoint =  `${ENV.APP.API_HOST}/dynamic_sponsor_offer/` + offerCode;
    let { auth_token } = this.get('session.data.authenticated');
    fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      reject(error);
    });
  },*/
  
  loadedSponsorOffers: computed('sponsorOffers',function() {
    return this.get('sponsorOffers');
  }),
  
});
