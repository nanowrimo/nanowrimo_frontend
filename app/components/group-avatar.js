import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  currentUser: service(),
  group: null,
  linkTo: false,
  size: null,
  canEdit: false,
  editAction: null,
  
  init(){
    this._super(...arguments);
    if (!this.get('size') ){
      this.set('size', 'large');
    }
  },

  isRegion: computed('group.groupType', function() {
    let gt = this.get('group.groupType');
    if (gt=='region') {
      return true;
    } else {
      return false;
    }
  }),
  
  isWritingGroup: computed('group.groupType', function() {
    let gt = this.get('group.groupType');
    if (gt=='writing group') {
      return true;
    } else {
      return false;
    }
  }),

  actions: {
    edit(){
      //get the edit action
      let ea = this.get('editAction');
      //is there an edit action?
      if (ea) {
        //perform the action
        ea();
      }
    }
  }
  
});

/* Usage 
 * 
 * user: the user to show
 * linkTo: boolean, create a link to the user
 * size: the size styling for the avatar. option: "small", "medium", "large", "irregular"
 * canEdit: boolean, allows for clicking to edit
 * editAction: the action to run when clicked to edit
 * 
 * 
 * 
 * 
 */ 
