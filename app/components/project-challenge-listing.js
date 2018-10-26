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
    this.set('deleteConfirmationYesText', 'Yes');
    this.set('deleteConfirmationNoText', 'No'); 
    this.set('deleteConfirmationTitleText', 'Confirm');
    this.set('deleteConfirmationBodyText', 'Do you really wish to delete this goal?');
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
