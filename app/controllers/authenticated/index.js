import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';


export default Controller.extend({
  store: service(),
  currentUser: service(),
  router: service(),

  currentUserName: reads('currentUser.user.name'),
  currentUserEmail: reads('currentUser.user.email'),
  currentUserIsNotConfirmed: reads('currentUser.user.isNotConfirmed'),
  currentUserHasProject: computed('currentUser.user.projects.{[],@each.primary}', function () {
    let cu = this.get('currentUser.user');
    if (cu) {
      return cu.persistedProjects.length > 0;
    } else {
      return false;
    }
  }),
  primaryProject: computed("currentUser.user.primaryProject", function () {
    let p = this.get('currentUser.user.primaryProject');
    return p;
  }),

  // Returns true is it's camp and the user hasn't created a project
  displayCampBanner: computed('currentUser.user.projects.[]', 'primaryProject.currentProjectChallenge.count', function () {
    let d = false;
    // Set a local variable for the store
    let store = this.get('store');
    // Set a local variable for all challenges in the store
    let cs = store.peekAll('challenge');
    // Set a local variable for the correct challenge
    let newc = null;
    // Loop through the challenges to find the latest event
    cs.forEach(function (c) {
      // If this is an event
      if ((c.eventType == 0) || (c.eventType == 1)) {
        // If the challenge is newer than ones already found
        if ((newc === null) || (newc.endsAt < c.endsAt)) {
          // Set the challenge variable to this challenge
          newc = c;
        }
      }
    });
    // If the challenge has been found...
    if (newc) {
      // Get the current user
      let cu = this.get('currentUser.user');
      if (cu) {
        if (cu.currentDateInDateRange(newc.prepStartsAt, newc.endsAt)) {
          if (newc.eventType == 1) {
            d = true;
            // Get all project_challenges
            let pcs = store.peekAll('project-challenge');
            // Loop through them
            pcs.forEach(function (pc) {
              // If this project challenge is for the latest event...
              if (newc.id == pc.challenge_id) {
                // Find the associated project
                let p = store.peekRecord('project', pc.project_id);
                // If the project is found
                if (p) {
                  // If the current user is the author
                  if (p.user_id == cu.id) {
                    d = false;
                  }
                }
              }
            });
          }
        }
      }
    }
    // Return if they won or not
    return d;
  }),

  // Returns true is it's camp and the user hasn't created a project
  displayNanoBanner: computed('currentUser.user.projects.[]', 'primaryProject.currentProjectChallenge.count', function () {
    let ps = this.get('currentUser.user.projects');
    let c = this.get('primaryProject.currentProjectChallenge.count');
    let d = false;
    if (ps === c) {
      d = false;
    }
    // Set a local variable for the store
    let store = this.get('store');
    // Set a local variable for all challenges in the store
    let cs = store.peekAll('challenge');
    // Set a local variable for the correct challenge
    let newc = null;
    // Loop through the challenges to find the latest event
    cs.forEach(function (c) {
      // If this is an event
      if ((c.eventType == 0) || (c.eventType == 1)) {
        // If the challenge is newer than ones already found
        if ((newc === null) || (newc.endsAt < c.endsAt)) {
          // Set the challenge variable to this challenge
          newc = c;
        }
      }
    });
    // If the challenge has been found...
    if (newc) {
      // Get the current user
      let cu = this.get('currentUser.user');
      if (cu) {
        if (cu.currentDateInDateRange(newc.prepStartsAt, newc.endsAt)) {
          if (newc.eventType == 0) {
            d = true;
            // Get all project_challenges
            let pcs = store.peekAll('project-challenge');
            // Loop through them
            pcs.forEach(function (pc) {
              // If this project challenge is for the latest event...
              if (newc.id == pc.challenge_id) {
                // Find the associated project
                let p = store.peekRecord('project', pc.project_id);
                // If the project is found
                if (p) {
                  // If the current user is the author
                  if (p.user_id == cu.id) {
                    d = false;
                  }
                }
              }
            });
          }
        }
      }
    }
    // Return if they won or not
    return d;
  }),

  // Returns the current event name if it's happening, false if not
  currentEventWelcome: computed('currentUser.user.projects.[]', 'primaryProject.currentProjectChallenge.count', function () {
    let str = "Welcome";
    // Set a local variable for the store
    let store = this.get('store');
    // Set a local variable for all challenges in the store
    let cs = store.peekAll('challenge');
    // Set a local variable for the correct challenge
    let newc = null;
    // Loop through the challenges to find the latest event
    cs.forEach(function (c) {
      // If this is an event
      if ((c.eventType == 0) || (c.eventType == 1)) {
        // If the challenge is newer than ones already found
        if ((newc === null) || (newc.endsAt < c.endsAt)) {
          // Set the challenge variable to this challenge
          newc = c;
        }
      }
    });
    // If the challenge has been found...
    if (newc) {
      // Get the current user
      let cu = this.get('currentUser.user');
      if (cu) {
        if (cu.currentDateInDateRange(newc.prepStartsAt, newc.endsAt)) {
          if (newc.eventType == 1) {
            str = "<img alt='Tent.' src='/images/global/tent.svg' style='width: 36px; padding-bottom: 10px;' /> Welcome to Camp";
          } else {
            str = "<img alt='Horned helmet ' src='/images/global/helmet.svg' style='width: 36px; padding-bottom: 10px;' /> Welcome to " + newc.name;
          }
        }
      }
    }
    // Return if they won or not
    return str;
  }),

  // Returns true if user has won latest event, false if not
  currentEventWon: computed('currentUser.user.projects.[]', 'primaryProject.currentProjectChallenge.count', function () {
    // Set a variable to return
    let winner = false;
    // Set a local variable for the store
    let store = this.get('store');
    // Set a local variable for all challenges in the store
    let cs = store.peekAll('challenge');
    // Set a local variable for the correct challenge
    let newc = null;
    // Loop through the challenges to find the latest event
    cs.forEach(function (c) {
      // If this is a November event
      if (c.eventType == 0) {
        // If the challenge is newer than ones already found
        if ((newc === null) || (newc.endsAt < c.endsAt)) {
          // Set the challenge variable to this challenge
          newc = c;
        }
      }
    });
    // If the challenge has been found...
    if (newc) {
      // Get the current user id
      let cuid = this.get('currentUser.user.id');
      // If the current user id exists...
      if (cuid) {
        // Get all project_challenges
        let pcs = store.peekAll('project-challenge');
        // Loop through them
        pcs.forEach(function (pc) {
          // If this project challenge is for the latest event...
          if (newc.id == pc.challenge_id) {
            // Find the associated project
            let p = store.peekRecord('project', pc.project_id);
            // If the project is found
            if (p) {
              // If the current user is the author
              if (p.user_id == cuid) {
                // if the goal has been met
                if (pc.count >= pc.goal) {
                  // The user won
                  winner = true;
                }
              }
            }
          }
        });
      }
    }
    // Return if they won or not
    return winner;
  }),


  queryParams: ['addProject'],

  addProject: false,

  actions: {
    afterProjectModalClose() {
      this.set('addProject', null);
    },
    openNewProjectModal() {
      this.set('addProject', true);
    },
    afterNewProjectSubmit() {
      this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
    }
  }
});
