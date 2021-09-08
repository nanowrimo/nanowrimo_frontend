import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  session: service(),
  currentUser: service(),
  newNotifications: null,
  init() {
    this._super(...arguments);
  },
  
  load() {
    if (this.get('session.isAuthenticated')) {
      debounce(this, this.cyclePing, 3000, false);
    }
  },
  
  pingApi: function(){
    let { auth_token }  = this.get('session.data.authenticated');
    let endpoint = `${ENV.APP.API_HOST}/ping`;
    return fetch((endpoint), { 
      method: 'get',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then((response) => {
      return response.json().then((json)=>{
        this.set("newNotifications", json.data.notifications);
      })
    }).catch(() => {
      //alert('Something went wrong! Please reload the page and try again.');
    });
  },
  
  cyclePing() {
    this.pingApi();
    debounce(this, this.cyclePing, 10000, false);
  },
    
});
