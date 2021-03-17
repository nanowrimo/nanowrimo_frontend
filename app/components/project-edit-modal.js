import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Project from 'nanowrimo/models/project';

const DEFAULT_TAB = 'overview';

export default Component.extend({
  store: service(),
  tagName: '',

  open: null,
  user: null,
  project: null,
  newPrimaryValue: false,
  showConfirmDelete: false,
  
  filteredOptionsForGenres: computed("optionsForGenres.[]", function(){
    let userId = this.get('user.id');
    return this.get('optionsForGenres').reject((option)=>{
      return (option.userId!=0 && option.userId!=userId);
    });
  }),
  
  optionsForGenres: computed(function() {
    return this.get('store').findAll('genre');
  }),
  optionsForPrivacy: computed(function() {
    return Project.optionsForPrivacy;
  }),
  optionsForStatus: computed(function() {
    return Project.optionsForStatus;
  }),
  optionsForWritingType: computed(function() {
    return Project.optionsForWritingType;
  }),

  activeTab: computed('tab', {
    get() {
      return this.get('tab') || DEFAULT_TAB;
    },
    set(key, value) {
      if (value === DEFAULT_TAB) {
        this.set('tab', null);
      } else {
        this.set('tab', value);
      }
      return value;
    }
  }),
  
  init(){
    this._super(...arguments);
    this.set('deleteConfirmationTitleText', "Confirm Delete");
    let title = this.get('project.title');
    this.set('deleteConfirmationQuestion', `Delete "${title}"?`);
    this.set('deleteConfirmationQuestionAddendum', "Deleting your project will also delete all associated goals and writing progress.");
    this.set('deleteConfirmationYesText','Delete'); 
    this.set('deleteConfirmationNoText','Cancel'); 
  },

  actions: {
    
    confirmDelete(){
      // set the title
      let title = this.get('project.title');
      this.set('deleteConfirmationQuestion', `Delete "${title}"?`);
      //show the delete dialog
      this.set('showConfirmDelete', true);      
    },
    
    deleteConfirmationYes(){
      this.get('project').destroyRecord();
      //close the modal
      this.set('showConfirmDelete', false);
      this.set('open',false);
    },
    deleteConfirmationNo(){
      //close the modal
      this.set('showConfirmDelete', false);
      this.set('open',false);
    },
    

    onShow() {
      this.set('open', true);
      //what doing?
      if (this.get('project.isNotPrimary')){
        this.set('project.primary', 0);
      }
    },
    
    onHidden() {
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
