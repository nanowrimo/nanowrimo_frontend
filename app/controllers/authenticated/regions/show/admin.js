import Controller from '@ember/controller';
import { computed, observer }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  activeTab: 'members',
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.user.groupUsersLoaded',function() {
    if (this.get('currentUser.user.groupUsersLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        let found = false;
        gus.forEach((gu)=>{
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
            found = true;
          }
        });
        return found;
      }
    } else {
      return false;
    }
  }),
  
  /*endpoint: computed('group',function() {
    let gid = this.get('group.id');
    let url = `${ENV.APP.API_HOST}/groups/` + gid + `/`;
    return url;
  }),*/
  
  /*membersEndpoint: computed('endpoint',function() {
    return this.get('endpoint') + `/admin_get_users`;
  }),*/
  
  /*membersClass: computed('activeTab', function() {
    let t = this.get('activeTab');
    if (t==='members') {
      return 'active-tab';
    }
    return '';
  }),
  
  writingClass: computed('activeTab', function() {
    let t = this.get('activeTab');
    if (t==='writing') {
      return 'active-tab';
    }
    return '';
  }),
  
  locationsClass: computed('activeTab', function() {
    let t = this.get('activeTab');
    if (t==='locations') {
      return 'active-tab';
    }
    return '';
  }),
  
  overlapClass: computed('activeTab', function() {
    let t = this.get('activeTab');
    if (t==='overlap') {
      return 'active-tab';
    }
    return '';
  }),
  
  membersObserver: observer('activeTab', function(){
    let t = this.get('activeTab');
    if (t==='members') {
      this.loadMembersList();
    }
  }),*/
  
  
  /*loadMembersList: function() {
    let t = this.get('activeTab');
    if (t==='members') {
      alert('looking');
      let url = this.get('membersEndpoint');
      //get the session auth token so we can add it to the request header
      let { auth_token }  = this.get('session.data.authenticated');
      return fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((resp)=>{
        alert('p');
        console.log(resp);
        this.set('membersList', resp.json());
      });
    }
  },*/
  
  /*membersListOld: computed('membersEndpoint','activeTab',function() {
    let t = this.get('activeTab');
    if (t==='members') {
      alert('looking');
      let url = this.get('membersEndpoint');
      //get the session auth token so we can add it to the request header
      let { auth_token }  = this.get('session.data.authenticated');
      return fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((resp)=>{
        return resp.json().then((json)=>{
          return json;
        });
      });
    }
  }),*/
  
  
});
