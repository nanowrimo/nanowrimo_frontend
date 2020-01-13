import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


export default Model.extend({
  isAdmin: attr('boolean', { defaultValue: '0' }),
  invitedById: attr('number'),
  invitationAccepted: attr('number', { defaultValue: '1' }),
  entryAt: attr('date'),
  entryMethod: attr('string'),
  exitAt: attr('date'),
  exitMethod: attr('string'),
  primary: attr('number'),
  group_id: attr('number'),
  user_id: attr('number'),
  messagesReadAt: attr('date'),
  latestMessage: attr('string'),
  numUnreadMessages: attr('number'),
  groupType: attr('string'),
  group: belongsTo('group'),
  user: belongsTo('user'),
  
  normalize() {
    let store = this.get('store');
    let g = store.peekRecord('group', this.group_id);
    let u = store.peekRecord('user', this.user_id);
    if (g) {
      this.set('group',g);
      g.groupUsers.pushObject(this);
      if (u) {
        g.users.pushObject(u);
      }
    }
    if (u) {
      this.set('user',u);
      u.groupUsers.pushObject(this);
      if (g) {
        u.groups.pushObject(g);
      }
    }
  },
  
});
