import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  session: service(),
  currentUser: service(),
  badgesService: service(),
  notificationsService: service(),
  notificationData: null,
  unreadMessageCount: 0,
  //groupsWithUnreadMessages: null,
  messageData: null,
  instantiated: false,
  buddiesData: null,
  buddyProjectsLastUpdatedAt: null,
  updateCount: 1,
  buddyshipUpdatedAt: 0,
  badgesUpdatedAt: 0,
  pingDelay: null,
  notificationReset: 0,
  
  init() {
    this._super(...arguments);
    this.set('pingDelay', 5000); 
    this.set('buddiesData', []);
  },
  
  load() {
    if (this.get('session.isAuthenticated')) {
      // load the initial badge data 
      //this.get('badgesService').getBaseBadgeData();
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
    let endpoint = `${ENV.APP.API_HOST}/ping?buddy_projects_last_updated_at=` + this.get('buddyProjectsLastUpdatedAt');
    // if this service has not been instantiated, instantiate
    if (!this.get("instantiated")) {
      endpoint+="&instantiate=true";
      this.set('instantiated', true);
    }
    return fetch((endpoint), { 
      method: 'get',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then((response) => {
      return response.json().then((json)=>{
        // track the last update
        this.set('buddiesLastUpdatedAt', json.data.buddies_last_updated_dt);
        this.checkBadgeUpdates(json.data.badges_updated_at);
        this.set("notificationData", json.data.notifications);
        // process the message data
        //let groups = [];
        //let count = 0;
        // loop through the data
        //json.data.messages.forEach((dataSet)=>{
          //count += dataSet.unread_message_count;
          //groups.push(dataSet.group_id);
        //});
        this.set('messageData', json.data.message_data);
        let count = 0;
        json.data.message_data.forEach((dataSet)=>{
          count += dataSet.unread_message_count;
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
        // buddyship changes
        let buddyshipUpdatedAt = this.get('buddyshipUpdatedAt');
        // is this the first ping response?
        if (buddyshipUpdatedAt == 0) {
          // set the buddyshipUpdatedAt based on the response data
          this.set('buddyshipUpdatedAt', json.data.buddyship_updated_at);
        } else {
          if (buddyshipUpdatedAt < json.data.buddyship_updated_at){
            // update the user's buddies
            this.get('currentUser').reloadBuddies();
            // record the updated at
            this.set('buddyshipUpdatedAt', json.data.buddyship_updated_at);
          }
        }        
        this.set('buddiesData',bd);
        this.set('buddyProjectsLastUpdatedAt',json.data.buddy_projects_last_updated_at);
        this.set('unreadMessageCount', count);
        //this.set('groupsWithUnreadMessages', groups);
        // check the notification_reset
        if (json.data.notification_reset > this.get('notificationReset') ) {
          this.set('notificationReset', json.data.notification_reset);
          // perform the reset
          this.get('notificationsService').reset();
        }
        this.incrementUpdateCount();
      })
    }).catch(() => {
      //alert('Something went wrong! Please reload the page and try again.');
    });
  },
  
  loopApiRequest() {
    this.fetchApiData();
    let delay = this.get('pingDelay'); 
    debounce(this, this.loopApiRequest, delay, false);
  },
  
  checkBadgeUpdates(timeFromPing) {
    let localCheckTime = this.get('badgesUpdatedAt');
    // is the local check time older than the the time send by Ping?
    if (localCheckTime < timeFromPing) {
      // update the lock check time
      this.set('badgesUpdatedAt',  timeFromPing);
      // update the badges
      this.get('badgesService').checkForUpdates();
    }
  }
});
