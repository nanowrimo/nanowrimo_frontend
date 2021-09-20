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
  isSubmittedNoEmail: false,
  
  init() {
    this._super(...arguments);
    this.setNewNanoMessage();
    // No email confirmation settings
    this.set('cancelConfirmationYesText', 'Continue');
    this.set('cancelConfirmationNoText', 'Cancel'); 
    this.set('cancelConfirmationTitleText', 'Send without email?');
    this.set('cancelConfirmationQuestion', `You didn't select the "Also send message by email" option. Would you like to continue and send this message without triggering an email send?`);
  },

  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },
  
  userIsAdmin: computed('group','currentUser.isLoaded}',function() {
    let found = false;
    let g = this.get('group');
    if (this.get('currentUser.isLoaded')) {
      let gus = this.get('store').peekAll('groupUser');
      let cu = this.get('currentUser.user');
      gus.forEach(function(gu) {
        if ((gu.group_id==g.id)&&(gu.user_id==cu.id)&&(gu.isAdmin)) {
          found = true;
        }
      });
    }
    return found;
  }),
  contextNotNanomessages: computed('context','group.groupType',function() {
    let c = this.get('context');
    let gt = this.get('group.groupType');
    return ((c!='nanomessages')&&(gt!='writing group'));
  }),
  
  showForm: computed('context','group',function() {
    let c = this.get("context");
    let t = this.get('group');
    let gt = t.groupType;
    let showit = false;
    if (c!='nanomessages') {
      showit = true;
    } else {
      if (gt=='buddies') {
        showit = true;
      } else {
        showit = this.get('userIsAdmin');
      }
    }
    return showit;
  }),
  
  iconClass: computed(function() {
    return "fa fa-paper-plane-o";
  }),
  
  actions: {
    doingSomething(isChecked) {
      this.set('adminIsChecked',isChecked);
    },
    doEmailChecked(isChecked) {
      this.set('emailIsChecked',isChecked);
    },
    
    confirmCancel(){
      //show the delete dialog
      this.set('showConfirmCancel', true);
    },
    cancelConfirmationYes(){
      this.doCancel();
      //close the modal
      this.set('showConfirmCancel', false);
    },
    cancelConfirmationNo(){
      //close the modal
      this.set('showConfirmCancel', false);
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
          document.querySelector('.medium-editor-element').innerHTML = '';
          let rm = this.get('refreshMessages');
          rm();
          //set a new nanomessage
          this.setNewNanoMessage();
        });
      }
    },
  }, 
  setNewNanoMessage() {
    let nm = this.get('store').createRecord('nanomessage');
    let cu = this.get('currentUser.user');
    nm.set('user',cu);
    let g = this.get('group');
    nm.set('group',g);
    this.set('newNanomessage', nm);
  }
});
