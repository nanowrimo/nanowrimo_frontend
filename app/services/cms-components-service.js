import Service from '@ember/service';
import { computed }  from '@ember/object';
//import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  currentUser: service(),
  
  pepTalks: null,
  
  getPepTalks() {
    let endpoint =  `${ENV.APP.API_HOST}/pages/staff`;
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
  
});
