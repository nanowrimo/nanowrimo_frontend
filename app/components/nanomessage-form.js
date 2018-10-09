import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  currentUser: service(),
  newNanomessage: null,
  group: null,
  refreshMessages: null,
  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },

  init() {
    this._super(...arguments);
    let nm = this.get('store').createRecord('nanomessage');
    let cu = this.get('currentUser.user');
    nm.set('user',cu);
    let g = this.get('group');
    nm.set('group',g);
    this.set('newNanomessage', nm);
  },

  actions: {
    afterSubmit() {
      let rm = this.get('refreshMessages');
      rm();
    },
  }
});
