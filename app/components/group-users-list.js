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
  searching: false,
  
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
        include: 'user'
      });
    }
    if (lt == 'MLs') {
      this.get('store').query('groupUser', {
        filter: { group_id: g.id, isAdmin: true },
        include: 'user'
      });
    }
  },
  
  // Returns the title label for the card
  cardLabel: computed('listType','primaryDisplay','guCount','guAllowed','guRemaining',function() {
    let lt = this.get('listType');
    let pd = this.get('primaryDisplay');
    let guCount = this.get('guCount');
    let guRemaining = this.get('guRemaining');
    let guAllowed = this.get('guAllowed');
    if (lt == 'eventAll') {
      return 'Attending';
    }
    if (lt == 'MLs') {
      return 'Your MLs';
    }
    if (lt == 'all') {
      if (pd) {
        return 'Members (' + guCount + ' of ' + guAllowed + ')';
      } else {
        return 'Invitations (' + guRemaining + ' remaining)';
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
  
  guAllowed: computed('group',function() {
    let g = this.get('group');
    return g.maxMemberCount;
  }),
  
  guCount: computed('groupUsersAttending.[]','groupUsersInvited.[]',function() {
    let gua = this.get('groupUsersAttending');
    let gui = this.get('groupUsersInvited');
    return (gua.length + gui.length);
  }),
  
  guRemaining: computed('guCount','guAllowed',function() {
    let guCount = this.get('guCount');
    let guAllowed = this.get('guAllowed');
    return (guAllowed - guCount);
  }),
  
  isAdmin: computed('allGroupUsers.[]','currentUser.user.id','group.id',function() {
    let gus = this.get('allGroupUsers');
    let cuid = this.get('currentUser.user.id');
    let gid = this.get('group.id');
    let found = false;
    gus.forEach((gu) => {
      if ((gu.group_id==gid)&&(gu.user_id==cuid)&&(gu.isAdmin)) {
        found = true;
      }
    });
    return found;
  }),
  canInviteUsers: computed('isAdmin','group.joiningRule',function() {
    let isAdmin = this.get('isAdmin');
    let joiningRule = this.get('group.joiningRule');
    return (isAdmin || (joiningRule>0));
  }),
  
  actions: {
    getSearchResults() {
      this.set('searching',true);
      let str = this.get('searchString');
      let endpoint =  `${ENV.APP.API_HOST}/search?q=` + str;
      let t = this;
      let { auth_token } = this.get('session.data.authenticated');
      return fetch(endpoint, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then((resp)=>{
        this.set('searching',false);
        return resp.json().then((json)=>{
          t.set('searchResults',json);
        });
      });
    },
  },
  
});
