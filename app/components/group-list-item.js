import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentUser: service(),
  store: service(),
  joinable: null,
  leavable: null,
  groupContainer: null,
  listOrder: null,
  limitList: null,
  sortBySearch: null,
  thisGroup: computed('groupContainer', function() {
    let groupContainer = this.get('groupContainer');
    return groupContainer.groupObject;
  }),
  init() {
    this._super(...arguments);
  },
  
  actions: {
    joinGroup() {
      let gu = this.get('store').createRecord('groupUser', {
        user: this.get('currentUser.user'),
        group: this.get('thisGroup'),
        is_admin: 0
      });
      gu.save();
      let cu = this.get('currentUser.user');
      let g = this.get('thisGroup');
      cu.get('groupUsers').pushObject(gu);
      g.get('groupUsers').pushObject(gu);
      cu.get('groups').pushObject(g);
      g.get('users').pushObject(cu);
    },
    leaveGroup() {
      let cu = this.get('currentUser.user');
      let g = this.get('thisGroup');
      let gu = null;
      cu.groupUsers.forEach(function(obj) {
        if (obj.group_id==g.id) {
          gu = obj;
        }
      });
      if (gu) {
        cu.get('groupUsers').removeObject(gu);
        g.get('groupUsers').removeObject(gu);
        cu.get('groups').removeObject(g);
        g.get('users').removeObject(cu);
        gu.deleteRecord();
        gu.save();
      }
      //let cu = this.get('currentUser.user');
      //let g = this.get('thisGroup');
      //cu.get('groupUsers').removeObject(gu);
      //g.get('groupUsers').removeObject(gu);
      //cu.get('groups').removeObject(g);
      //g.get('users').removeObject(cu);
      //gu.deleteRecord();
      //gu.save();
    }
    
  }
  
});
