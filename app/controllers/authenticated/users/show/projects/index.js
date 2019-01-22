import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  
  queryParams: ['addProject'],

  addProject: false,
  projects: alias('user.persistedProjects'),
  sortOptions: null,
  selectedSortOption: null,
  user: null,

  sortedProjects: sort('displayProjects', 'selectedSortOption'),
  
  displayProjects: computed('projects.{[],@each.primary}', function(){
    return this.get('projects');
  }),
  
  canAddProject: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),

  init() {
    this._super(...arguments);
    let options = ['createdAt:desc', 'title:asc'];
    this.set('sortOptions', options);
    this.set('selectedSortOption', [options[0]]);
   
  },

  actions: {
    afterProjectModalClose() {
      this.set('addProject', null);
      
    },
    openNewProjectModal() {
      if (this.get('canAddProject')) {
        this.set('addProject', true);
      }
    },
    setSortSelection(val) {
      val = parseInt(val);
      let option = this.get('sortOptions')[val];
      this.set('selectedSortOption', [option]);
    }
  }
});
