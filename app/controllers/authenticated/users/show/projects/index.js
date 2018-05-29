import Controller from '@ember/controller';
import { alias, sort } from '@ember/object/computed';
export default Controller.extend({
  projects: alias('model'),
  sortedProjects: sort('projects', 'selectedSortOption'),
  sortOptions: null,
  selectedSortOption: null,
  
  actions: {
    newProject(){
      //console.log('new project');
    },
    setSortSelection(val) {
       this.set('selectedSortOption', [val]);
    }
  },
  
  init() {
    this._super(...arguments);
    let options = ['createdAt:desc', 'name'];
    this.set('sortOptions', options);
    this.set('selectedSortOption', [options[0]]);
  }
});
