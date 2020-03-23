import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  newNanomessage: null,
  refreshMessages: null,
  group: null,
  content: null,
  context: null,
  adminIsChecked: null,
  emailIsChecked: null,
  isDisabled: false,
  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },
  
  userIsAdmin: computed('currentUser.user.{isLoaded,groupUsersLoaded}',function() {
    let found = false;
    if (this.get('currentUser.user.isLoaded')) {
      if (this.get('currentUser.user.groupUsersLoaded')) {
        let gus = this.get('store').peekAll('groupUser');
        let g = this.get('group');
        let cu = this.get('currentUser.user');
        gus.forEach(function(gu) {
          if ((gu.group_id==g.id)&&(gu.user_id==cu.id)&&(gu.isAdmin)) {
            found = true;
          }
        });
      }
    }
    return found;
  }),
  contextNotNanomessages: computed('context','group.groupType',function() {
    let c = this.get('context');
    let gt = this.get('group.groupType');
    return ((c!='nanomessages')&&(gt!='writing group'));
  }),
  showForm: computed('context',function() {
    let c = this.get("context");
    let t = this.get('group.groupType');
    let showit = false;
    if (c!='nanomessages') {
      showit = true;
    } else {
      if (t=='buddies') {
        showit = true;
      } else {
        let uia = this.get('userIsAdmin');
        if (uia) {
          showit = true;
        }
      }
    }
    return showit;
  }),
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
    doingSomething(isChecked) {
      this.set('adminIsChecked',isChecked);
    },
    doEmailChecked(isChecked) {
      this.set('emailIsChecked',isChecked);
    },
    afterSubmit() {
      this.set('isDisabled',true);
      let i = document.querySelector('.medium-editor-element').innerHTML;
      let tx = document.querySelector('.medium-editor-element').textContent;
      let nm = this.get('newNanomessage');
      let c = this.get('adminIsChecked');
      let e = this.get('emailIsChecked');
      nm.set('content',i);
      nm.set('official',c);
      nm.set('send_email',e);
      if (tx) {
        nm.save().then(() => {
          this.set('isDisabled',false);
          let rm = this.get('refreshMessages');
          rm();
        });
      }
    },
  }
});
