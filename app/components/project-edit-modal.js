import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Project from 'nanowrimo/models/project';

export default Component.extend({
  store: service(),
  tagName: '',

  open: null,
  user: null,
  project: null,
  newPrimaryValue: false,
  
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

  actions: {

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
