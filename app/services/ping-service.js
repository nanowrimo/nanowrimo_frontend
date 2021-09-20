import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  session: service(),
  currentUser: service(),
  notificationData: null,
  unreadMessageCount: 0,
  groupsWithUnreadMessages: null,
  instantiated: false,
  
  init() {
    this._super(...arguments);
  },
  
  load() {
    if (this.get('session.isAuthenticated')) {
      this.loopApiRequest();
    }
  },
  
  fetchApiData: function(){
    let { auth_token }  = this.get('session.data.authenticated');
    let endpoint = `${ENV.APP.API_HOST}/ping`;
    // if this service has not been instantiated, instantiate
    if (!this.get("instantiated")) {
      endpoint+="?instantiate=true";
      this.set('instantiated', true);
    }
    return fetch((endpoint), { 
      method: 'get',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then((response) => {
      return response.json().then((json)=>{
        this.set("notificationData", json.data.notifications);
        // process the message data
        let groups = [];
        let count = 0;
        // loop through the data
        json.data.messages.forEach((dataSet)=>{
          count += dataSet.unread_message_count;
          groups.push(dataSet.group_id);
        });

        this.set('unreadMessageCount', count);
        this.set('groupsWithUnreadMessages', groups);
        
      })
    }).catch(() => {
      //alert('Something went wrong! Please reload the page and try again.');
    });
  },
  
  loopApiRequest() {
    this.fetchApiData();
    debounce(this, this.loopApiRequest, 5000, false);
  },
    
});
