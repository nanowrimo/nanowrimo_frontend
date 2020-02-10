import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  currentUser: service(),
  store: service(),
  session: service(),
  group: null,
  groupUsers: null,
  listType: null,
  primaryDisplay: true,
  searchString: '',
  searchResults: null,
  
  init() {
    this._super(...arguments);
    this.checkForUpdates();
  },
  
  // Loads any necessary user data from the API
  checkForUpdates() {
    let g = this.get('group');
    let lt = this.get('listType');
    if ((lt == 'eventAll')||(lt == 'all')) {
      this.get('store').query('groupUser', {
        filter: { group_id: g.id },
        include: 'users'
      });
    }
    if (lt == 'MLs') {
      this.get('store').query('groupUser', {
        filter: { group_id: g.id, isAdmin: true },
        include: 'users'
      });
    }
  },
  
  // Returns the title label for the card
  cardLabel: computed('listType','primaryDisplay',function() {
    let lt = this.get('listType');
    let pd = this.get('primaryDisplay');
    if (lt == 'eventAll') {
      return 'Attending';
    }
    if (lt == 'MLs') {
      return 'Your MLs';
    }
    if (lt == 'all') {
      if (pd) {
        return 'Members (5 of 12)';
      } else {
        return 'Invitations (7 remaining)';
      }
    }
    return "Members";
  }),
  
  // Returns the size of the user avatars
  itemSize: computed('listType',function() {
    let lt = this.get('listType');
    if (lt == 'eventAll') {
      return 'small';
    }
    if ((lt == 'MLs')||(lt == 'kall')) {
      return 'medium';
    }
    return "small";
  }),
  
  // Returns a list of all groupUsers in the store
  allGroupUsers: computed(function() {
    return this.get('store').peekAll('groupUser');
  }),
  
  // Figures out which users are attending
  groupUsersAttending: computed('allGroupUsers.[]',function() {
    let g = this.get('group');
    let lt = this.get('listType');
    let newgus = [];
    let gus = this.get('allGroupUsers');
    gus.forEach((gu) => {
      if (gu.invitationAccepted) {
        if (lt == 'MLs') {
          if ((gu.group_id==g.id)&&(gu.isAdmin)) {
            newgus.push(gu);
          }
        } else {
          if (gu.group_id==g.id) {
            newgus.push(gu);
          }
        }
      }
    });
    return newgus;
  }),
  
  // Figures out which users are attending
  groupUsersInvited: computed('allGroupUsers.[]',function() {
    let g = this.get('group');
    let lt = this.get('listType');
    let newgus = [];
    let gus = this.get('allGroupUsers');
    gus.forEach((gu) => {
      if (!gu.invitationAccepted) {
        if (lt == 'MLs') {
          if ((gu.group_id==g.id)&&(gu.isAdmin)) {
            newgus.push(gu);
          }
        } else {
          if (gu.group_id==g.id) {
            newgus.push(gu);
          }
        }
      }
    });
    return newgus;
  }),
  
  
  actions: {
    getSearchResults() {
      let str = this.get('searchString');
      let endpoint =  `${ENV.APP.API_HOST}/search?q=` + str;
      let t = this;
      let { auth_token } = this.get('session.data.authenticated');
      return fetch(endpoint, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((resp)=>{
        return resp.json().then((json)=>{
          t.set('searchResults',json);
        });
      });
    },
  },
  
});
