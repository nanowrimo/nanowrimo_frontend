import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { debounce } from '@ember/runloop';

export default Controller.extend({
  group: alias('model'),
  router: service(),
  newMessage: false,
  oldgroupid: null,
  
  hasGroup: computed('group','oldgroupid', function() {
    //alert('computing');
    let g = this.get('group');
    let ogid = this.get('oldgroupid');
    if (g) {
      if (ogid!=g.id) {
        debounce(this, this.setOldGroup, 200, false);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }),
  
  pageTitle: computed('group.{name,groupType}','hasGroup', function() {
    let hasGroup = this.get('hasGroup');
    if (hasGroup) {
      if (this.get('group.groupType')!='buddies') {
        return this.get('group.name') + " | NaNoMessages";
      } else {
        return "Buddies | NaNoMessages";
      }
    } else {
      return "NaNoMessages";
    }
  }),
  
  cardTitle: computed('newMessage', function() {
    if (this.get('newMessage')) {
      return 'New Message';
    } else {
      return 'NaNoMessages';
    }
  }),
  
  setOldGroup() {
    let g = this.get('group');
    this.set('oldgroupid',g.id);
  },
  clearGroup() {
    this.set('group',null);
    this.set('oldgroupid',null);
    let r = this.get('router');
    r.transitionTo('/nanomessages');
  },
  
  actions: {
    initiateNewMessage: function() {
      this.set('newMessage', true);
    },
    cancelNewMessage: function() {
      this.set('newMessage', false);
    },
  }
  
});
