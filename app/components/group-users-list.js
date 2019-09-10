import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
  currentUser: service(),
  store: service(),
  group: null,
  
  init() {
    this._super(...arguments);
  },
  
  /*checkForUpdates() {
    let g = this.get('group');
    let gid = g.id;
    let t = this;
    
    this.get('store').query('nanomessage', {
      group_id: gid
    }).then(function(ms) {
      t.set("messages",ms);
    });
  },*/

  getGroupUsers: computed(function() {
    let store = this.get('store');
    let g = this.get('group');
    return store.query('groupUser', {
      filter: { group_id: g.id },
      //include: 'users'
    });
  }),
  
});
