import Component from '@ember/component';
import { assert } from '@ember/debug';
import { sort } from '@ember/object/computed';
import { computed, observer }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),

  tagName: 'span',
  tab: null,
  open: null,
  project: null,
  challenge: null,
  newProject: null,
  // buttonContext is passed in by the parent, and specifies where the buttons are displaying
  buttonContext: null,
  
  init() {
    this._super(...arguments);
  },
  
  addSimpleProject: false,
  
  isChallengeYourself: computed("buttonContext", function(){
    let buttonContext = this.get("buttonContext");
    if (buttonContext == "challenge-yourself") {
      return true;
    }
    return false;
  }),
    
  isEventHub: computed("buttonContext", function(){
    let context = this.get("buttonContext");
    if (context == "event-hub") {
      return true;
    }
    return false;
  }),
  
  type: computed("challenge", function() {
    let challenge = this.get("challenge");
    if (challenge.eventType === 1) {
      return "Camp";
    }
    if (challenge.eventType === 0) {
      return "November";
    }
  }),
  
  // Returns true if the user has projects without active challenges
  hasInactiveProjects: computed("currentUser.user.inactiveProjects", function () {
    const currentUser = this.get("currentUser");
    let inactiveProjects = currentUser.user.inactiveProjects;
    return inactiveProjects.length;
  }),
  
  actions: {
    afterProjectModalClose() {
      this.set('addProject', null);
    },
    openNewProjectModal() {
      this.set('addProject', true);
    },
    openNewSimpleAddProjectModal() {
      this.set('newProject', true);
      this.set('addSimpleProject', true);
    },
    openNewSimpleExtendProjectModal() {
      this.set('newProject', false);
      this.set('addSimpleProject', true);
    },
    afterSimpleProjectModalClose() {
      this.set('addSimpleProject', null);
    },
    afterNewProjectSubmit() {
      this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
    },

    buttonClicked(){
      let action = this.get('buttonAction');
      if (action){
        action();
      }
    } 
    
  }
});
