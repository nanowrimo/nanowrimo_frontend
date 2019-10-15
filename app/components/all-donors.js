import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';


export default Component.extend({
  
  major: null,
  monthly: null,
  supporting: null,
  
  init() {
    this._super(...arguments);
    //start getting data
    this.getDonorData(this);
  },
  
  getDonorData: function(_this){
    let endpoint = `${ENV.APP.API_HOST}/donors`;
    return fetch(endpoint).then((response)=>{
      return response.json().then((json)=>{
         _this.set('major', json.major);
         _this.set('monthly', json.monthly);
         _this.set('supporting', json.supporting);
      });
    });
  },
  
  monthlyDonorString: computed('monthly.[]', function() {
    let md = this.get('monthly')
    if (md) {
      let names = [];
      md.forEach((d)=>{ 
        names.push(d); 
      });
      return names.join(", ");
    } else {
      return null;
    }
  }),
  
  majorDonorString: computed('major.[]', function() {
    let md = this.get('major');
    if (md) {
      let names = [];
      md.forEach((d)=>{ 
        names.push(d); 
      });
      return names.join(", ");
    } else {
      return null;
    }
  }),
  
  supportingDonorString: computed('supporting.[]', function() {
    let md = this.get('supporting');
    if (md) {
      let names = [];
      md.forEach((d)=>{ 
        names.push(d); 
      });
      return names.join(", ");
    } else {
      return null;
    }
  })
  
});
