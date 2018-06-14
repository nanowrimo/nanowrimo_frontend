import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),

  queryParams: ['addProject'],

  addProject: false,
  projects: alias('model'),
  sortedProjects: sort('projects', 'selectedSortOption'),
  sortOptions: null,
  selectedSortOption: null,
  user: null,

  canAddProject: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),

  init() {
    this._super(...arguments);
    let options = ['createdAt:desc', 'name'];
    this.set('sortOptions', options);
    this.set('selectedSortOption', [options[0]]);
  },

  actions: {
    afterProjectModalClose() {
      this.set('addProject', null);
      this.send('refreshModel');
    },
    openNewProjectModal() {
      if (this.get('canAddProject')) {
        this.set('addProject', true);
      }
    },
    setSortSelection(val) {
       this.set('selectedSortOption', [val]);
    }
  }
});
