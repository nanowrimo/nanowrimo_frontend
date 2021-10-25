import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import moment from 'moment';

export default Component.extend({
  store: service(),
  pingService: service(),
  currentUser: service(),
  group: null,
  selectedGroup: null,
  searchString: null,
  classNames: ["convo-item"],
  oldMessagesCount: 0,
  
  init() {
    this._super(...arguments);
    let g = this.get('group');
    if (g) {
      let lm = this.get('group.latestMessageDt');
      // if found, return the number of unread messages; otherwise return zero
      if (lm==null) {
        this.set('classNames', ['convo-item is-new']);
      }
    }
  },

  
  groupIsRegion: computed('group', function() {
    let g = this.get('group');
    if (g.get('groupType')=='region') {
      return true;
    } else {
      return false;
    }
  }),
  
  timeSince: computed('pingService.updateCount','group', 'group.latestMessageDt',function() {
    const updateCount = this.get('pingService.updateCount');
    let t = '';
    let g = this.get('group');
    if (g && updateCount) {
      let lm = this.get('group.latestMessageDt');
      if (lm!=null) {
        t = moment.utc(lm, 'YYYY-MM-DD HH:mm:ss').local().fromNow();
      }
    }
    return t;
  }),
  
  isSelected: computed('group','selectedGroup',function() {
    let g = this.get('group');
    let sg = this.get('selectedGroup');
    if (g && sg) {
      if (g.id==sg.id) {
        return 'is-selected';
      }
    }
    return '';
  }),
  
  // Changes the CSS when a conversation has new messages
  isUnread: computed('newNanomessagesCount','isSelected',function() {
    let c = this.get('newNanomessagesCount');
    let s = this.get('isSelected');
    if (c && (s=='')) {
      return 'is-unread';
    }
    return '';
  }),
  
  conversationLabel: computed('group',function() {
    let g = this.get('group');
    let store = this.get('store');
    let id = this.get('currentUser.user.id');
    let name = g.get('name');
    if (g.get('groupType')=='buddies') {
      let gus = g.get('groupUsers');
      gus.forEach(function(gu) {
        if (gu.user_id) {
          let u = store.peekRecord('user', gu.user_id);
          if ((u) && (u.id!=id) && (gu.invitationAccepted=='1')) {
            name = u.name;
          }
        }
      });
    }
    return name;
  }),
  conversationAvatar: computed('group',function() {
    let g = this.get('group');
    let store = this.get('store');
    let id = this.get('currentUser.user.id');
    let avatarUrl = '';
    if (g.get('groupType')=='buddies') {
      let gus = g.get('groupUsers');
      gus.forEach(function(gu) {
        if (gu.user_id) {
          let u = store.peekRecord('user', gu.user_id);
          if ((u) && (u.id!=id) && (gu.invitationAccepted=='1')) {
            avatarUrl = u.avatarUrl;
          }
        }
      });
    }
    if (g.get('groupType')=='region') {
      avatarUrl = g.avatarUrl;
    }
    return avatarUrl;
  }),
  
  conversationSlug: computed('group', function() {
    let g = this.get('group');
    return g.get('slug');
  }),
  
  newNanomessagesCount: computed('pingService.messageData','group', function() {
    const gwum = this.get('pingService.messageData');
    const g = this.get('group');
    const gid = g.get('id');
    let count = 0;
    gwum.forEach(function(obj) {
      // If this notification is about nanomessages
      if (obj.group_id==gid) {
        // Add the data count to the total
        count = obj.unread_message_count;
      }
    });
    // If the count has changed
    if (count != this.get('oldMessageCount')) {
      this.reloadGroup(count);
    }
    return count;
  }),
  
  // Reloads the group record in the store
  reloadGroup(count) {
    const g = this.get('group');
    const gid = g.get('id');
    this.set('oldMessageCount',count);
    this.store.findRecord('group', gid, {reload: true});
  },
  
  // Returns the group users in the store
  groupUsers: computed(function() {
    // Peek all group-user records in the store
    return this.get('store').peekAll('group-user');
  }),
  
  // Returns the group user record for this group and the current user
  groupUser: computed('group.id','groupUsers.[]', function() {
    let gus = this.get('groupUsers');
    let gid = this.get('group.id');
    let tgu = false;
    let cid = this.get('currentUser.user.id');
    if (gid) {
      // For each group user, check if it's the correct one for this group and current user
      gus.forEach(function(gu) {
        if ((gid==gu.group_id) && (cid==gu.user_id)) {
          tgu = gu;
        }
      });
    }
    // Return the correct group-user, or false if not found
    return tgu;
  }),
  // Returns the latestMessage for this group
  latestMessage: computed('group', 'group.latestMessage', function() {
    // Get the group user
    let g = this.get('group');
    if (g) {
      let lm = this.get('group.latestMessage');
      // if found, return the message; otherwise return null
      if (lm!=null) {
        // Strip tags from message
        var div = document.createElement("div");
        div.innerHTML = lm;
        var text = div.textContent || div.innerText || "";
        // Truncate string
        if (text.length>75) {
          text = text.substring(0,75) + '...';
        }
        return text;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }),
  
  nanomessagesDisplayStyle: computed('notificationsService.{newNanomessagesCount,recomputeNotifications}', 'newNanomessagesCount', function() {
    var c = this.get('newNanomessagesCount');
    if (c==0) return "nw-hidden";
    else return "";
  }),
  
  actions: {
  }
});
