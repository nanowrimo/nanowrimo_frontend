import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Project from 'nanowrimo/models/project';

export default Component.extend({
  store: service(),

  tagName: '',

  challenge: null,
  tab: null,
  open: null,
  project: null,
  user: null,

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

  steps: computed(function() {
    return [
      ['title', 'status', 'privacy', 'writingType'],
      [],
      ['wordCount', 'summary', 'excerpt', 'pinterest', 'playlist']
    ]
  }),

  init() {
    this._super(...arguments);
    let user = this.get('user');
    assert('Must pass a user into {{project-new-modal}}', user);
    let newProject = this.get('store').createRecord('project', { user });
    this.set('project', newProject);
  },

  actions: {
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
