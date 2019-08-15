import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  joinable: null,
  leavable: null,
  groupContainer: null,
  listOrder: null,
  limitList: null,
  sortBySearch: null,
  
  actions: {
    joinGroup() {
      let t = this;
      let gu = this.get('store').createRecord('groupUser', {
        user: this.get('currentUser.user'),
        group: this.get('groupContainer.groupObject'),
        isAdmin: 0
      });
      gu.save().then(() => {
        let cu = t.get('currentUser.user');
        let g = t.get('groupContainer.groupObject');
        cu.get('groupUsers').pushObject(gu);
        g.get('groupUsers').pushObject(gu);
        cu.get('groups').pushObject(g);
        g.get('users').pushObject(cu);
      });
    },
    makeHome() {
      let cu = this.get('currentUser.user');
      let g = this.get('groupContainer.groupObject');
      let gu = null;
      let maxPrimary = -1;
      cu.groupUsers.forEach(function(obj) {
        if (obj.primary>maxPrimary) {
          maxPrimary = obj.primary;
        }
        if (obj.group_id==g.id) {
          gu = obj;
        }
      });
      let newMax = maxPrimary + 1;
      gu.set('primary', newMax);
      gu.save().then(() => {
        let newInt = cu.set('recalculateHome') + 1;
        cu.set('recalculateHome', newInt);
      });
    },
    leaveGroup() {
      let cu = this.get('currentUser.user');
      let g = this.get('groupContainer.groupObject');
      let gu = null;
      cu.groupUsers.forEach(function(obj) {
        if (obj.group_id==g.id) {
          gu = obj;
        }
      });
      if (gu) {
        gu.deleteRecord();
        gu.save().then(() => {
          cu.get('groupUsers').removeObject(gu);
          g.get('groupUsers').removeObject(gu);
          cu.get('groups').removeObject(g);
          g.get('users').removeObject(cu);
        });
      }
    }
    
  }
  
});
