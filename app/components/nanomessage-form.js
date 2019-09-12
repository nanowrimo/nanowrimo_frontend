import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  newNanomessage: null,
  refreshMessages: null,
  group: null,
  content: null,
  
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
      let i = document.querySelector('.medium-editor-element').innerHTML;
      let tx = document.querySelector('.medium-editor-element').textContent;
      let nm = this.get('newNanomessage');
      nm.set('content',i);
      if (tx) {
        nm.save().then(() => {
          let rm = this.get('refreshMessages');
          rm();
        });
      }
    },
  }
});
