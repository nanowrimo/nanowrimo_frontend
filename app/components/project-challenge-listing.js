import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  editProjectChallenge: false,
  showConfirmDelete: false,
  
  canEdit: computed('project', function(){
    let currentUser = this.get('currentUser.user');
    let author = this.get('author');
    return currentUser === author;
  }),
  
  svg: computed('projectChallenge', function() {
    let str = (this.get('projectChallenge.unitType') === 0) ? 'writing' : 'editing';
    return `/images/goals/${str}.svg`
  }),
  
  
  init() {
    this._super(...arguments);
    this.set('deleteConfirmationYesText', 'Delete');
    this.set('deleteConfirmationNoText', 'Cancel'); 
    this.set('deleteConfirmationTitleText', 'Confirm Delete');
    let name = this.get('projectChallenge.name');
    this.set('deleteConfirmationQuestion', `Do you really want to delete the "${name}" goal?`);
  },
  
  
  
  actions: {
    editProjectChallenge(){
       this.set('editProjectChallenge', true);
    },

    confirmDelete(){
      //show the delete dialog
      this.set('showConfirmDelete', true);
    },
    
    deleteConfirmationYes(){
      //TODO: delete this projectChallenge
      //get the projectChallenge 
      this.get('projectChallenge').destroyRecord();
      //close the modal
      this.set('showConfirmDelete', false);
    },
    deleteConfirmationNo(){
      //close the modal
      this.set('showConfirmDelete', false);
    }
  }
});
