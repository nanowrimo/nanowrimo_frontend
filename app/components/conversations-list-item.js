import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import moment from 'moment';

export default Component.extend({
  store: service(),
  notificationsService: service(),
  currentUser: service(),
  group: null,
  selectedGroup: null,
  classNames: ["convo-item"],
  
  groupIsRegion: computed('group', function() {
    let g = this.get('group');
    if (g.get('groupType')=='region') {
      return true;
    } else {
      return false;
    }
  }),
  
  timeSince: computed('groupUser', 'groupUser.latestMessage',function() {
    let t = '';
    let gu = this.get('groupUser');
    if (gu) {
      let lm = this.get('groupUser.latestMessage');
      // if found, return the number of unread messages; otherwise return zero
      if (lm!=null) {
        var lm0 = lm.split("|-|");
        var dt = lm0[1];
        t = moment(dt).fromNow();
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
  
  newNanomessagesCount: computed('notificationsService.{newNanomessagesCount,recomputeNotifications}', function() {
    let nnc = this.get('notificationsService.newNanomessagesCount');
    let ns = this.store.peekAll('notification');
    let g = this.get('group');
    let gid = g.get('id');
    var count = 0;
    if (nnc==nnc) {
      ns.forEach(function(obj) {
        // If this notification is about nanomessages
        if ((obj.actionType=='NANOMESSAGES')&&(obj.actionId==gid)) {
          // Add the data count to the total
          count += obj.dataCount;
        }
      });
    }
    return count;
  }),
  
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
  latestMessage: computed('groupUser', 'groupUser.latestMessage', function() {
    // Get the group user
    let gu = this.get('groupUser');
    if (gu) {
      let lm = this.get('groupUser.latestMessage');
      // if found, return the number of unread messages; otherwise return zero
      if (lm!=null) {
        var lm0 = lm.split("|-|");
        // Strip tags from message
        var div = document.createElement("div");
        div.innerHTML = lm0[0];
        var text = div.textContent || div.innerText || "";
        // Truncate string
        if (text.length>75) {
          text = text.substring(0,75) + '...';
        }
        return text;
      } else {
        return "<p>There are no messages yet. Why not start the discussion?</p>";
      }
    } else {
      return "<p>There are no messages yet. Why not start the discussion?</p>";
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
