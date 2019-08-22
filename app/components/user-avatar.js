import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  currentUser: service(),
  user: null,
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

  laurelImagePath: computed('user.nanoWinCount', function(){
    let count = this.get('user.nanoWinCount');
    if (count > 10) {
      count = 10;
    }
    return `/images/users/laurels/${count}.svg`;
  }),
  
  hasLaurels: computed('user.nanoWinCount', function(){
    return this.get('user.nanoWinCount')>0;
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
