import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  router: service(),
  
  tab: null,
  open: null,
  group: null,
  validationErrors: null,
  hasValidationError: false,
  inProcess: true,
  groupCreated: false,
  
  init() {
    this._super(...arguments);
  },
  
  //attributeBindings: ["maxlength"],
  //maxlength: computed(function () {
    //return "80";
  //}),
  
  didReceiveAttrs(){
    if (this.get('open')){
      this.set('inProcess',true);
      this.set('groupCreated',false);
      //create a new group
      let newGroup = this.get('store').createRecord('group');
      newGroup.set('groupType','writing group');
      newGroup.set('name','My Writing Group');
      let uid = this.get('currentUser.user.id');
      newGroup.set('userId',uid);
      newGroup.set('groupId',null);
      newGroup.set('approvedById',0);
      newGroup.set('maxMemberCount',12);
      this.set('group', newGroup);
    }
  },
  
  actions: {
    
    // Called when the value of the name input changes
    nameChanged(val) {
      // Set the group name to the input string
      this.set('group.name', val);
      // If the name is empty, disable the submit button
      if ((val == "")||(val==null)) {
        this.set('hasValidationError',true);
      } else {
        this.set('hasValidationError',false);
      }
    },
    
    // Called when the submit button is pressed
    saveGroup() {
      let t = this;
      let s = this.get('store');
      let uid = this.get('currentUser.user.id');
      if (!this.get('hasValidationError') ){
        //assign the project to the project challenge
        let g = this.get('group');
        g.save().then(function() {
          let newGroupUser = s.createRecord('groupUser');
          newGroupUser.set('isAdmin',true);
          newGroupUser.set('group_id',g.id);
          newGroupUser.set('user_id',uid);
          newGroupUser.set('entryMethod','create');
          newGroupUser.save().then(function() {
            newGroupUser.normalize();
            t.set('inProcess',false);
            t.set('groupCreated',true);
          });
        });
      }
    },
    
    // Redirects to the writing group
    goToGroup() {
      let g = this.get('group');
      let r = this.get('router');
      //hide the modal
      this.set('open',false);
      r.transitionTo('authenticated.writing-groups.show.index', g.slug);
    },
    
    onHidden() {
      let g = this.get('group');
      if (!g.id) {
        g.unloadRecord();
      }
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
