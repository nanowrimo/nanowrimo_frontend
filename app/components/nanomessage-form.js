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
    //this.setNewNanoMessage();
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
  
  thisGroup: computed('group.id', function() {
    const groupid = this.get('group.id');
    //const gid = this.get('gid');
    const g = this.get('group');
    if (groupid && g) {
      //alert (gid + "|" + groupid + "|" + g.id);
      return g;
    } else {
      return null;
    }
  }),
  
  userIsML: computed('group.{id,groupType}','currentUser.isLoaded}',function() {
    let cu = this.get('currentUser.user');
    let group = this.get('group');
    if (cu.id && group.adminIds) {
      return group.adminIds.indexOf(cu.id) !== -1;
    }
    return false;    
  }),
  
  userIsAdmin: computed('group.{id,groupType}','currentUser.isLoaded}',function() {
    // user is admin if adminLevel > 0
    if (this.get("currentUser.user.adminLevel")>0 ) {
      return true;
    }
    return false;
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
        showit = this.get('userIsML');
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
      this.setNewNanoMessage();
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
        });
      }
    },
  }, 
  setNewNanoMessage() {
    let nm = this.get('store').createRecord('nanomessage');
    let cu = this.get('currentUser.user');
    nm.set('user',cu);
    let g = this.get('thisGroup');
    nm.set('group',g);
    this.set('newNanomessage', nm);
  }
});
