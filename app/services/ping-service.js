import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  session: service(),
  currentUser: service(),
  notificationData: null,
  unreadMessageCount: 0,
  groupsWithUnreadMessages: null,
  instantiated: false,
  buddiesData: null,
  updateCount: 1,
  
  init() {
    this._super(...arguments);
    this.set('buddiesData', []);
  },
  
  load() {
    if (this.get('session.isAuthenticated')) {
      this.loopApiRequest();
    }
  },
  
  // Retrieves the primary project state data for a specific buddy. Called by several other components.
  primaryProjectState: function(buddyId) {
    const buddiesData = this.get('buddiesData');
    let pps = null;
    for (let i = 0; i<buddiesData.length; i++) {
      if (buddiesData[i].user_id == buddyId) {
        pps = JSON.parse(buddiesData[i].primary_project_state);
      }
    }
    return pps;
  },
  
  // Increments the update count, which signals to other components that they might need to update themselves
  incrementUpdateCount: function(){
    if (this.isDestroyed) {
      return;
    }
    let updateCount = this.get('updateCount');
    this.set('updateCount', updateCount+1);
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
        
        // Handle buddies data
        let bd = this.get('buddiesData');
        json.data.buddies.forEach((dataSet)=>{
          // Remove buddies data from existing array if there's new information
          for (let i = bd.length - 1; i>-1; i--) {
            if (bd[i].user_id == dataSet.user_id) {
              bd.splice(i,1);
            }
          }
          // Add the new buddy data to the array
          bd.push(dataSet);
        });
        this.set('buddiesData',bd);
        this.set('unreadMessageCount', count);
        this.set('groupsWithUnreadMessages', groups);
        this.incrementUpdateCount();
      })
    }).catch(() => {
      //alert('Something went wrong! Please reload the page and try again.');
    });
  },
  
  loopApiRequest() {
    this.fetchApiData();
    debounce(this, this.loopApiRequest, 2000, false);
  },
    
});
