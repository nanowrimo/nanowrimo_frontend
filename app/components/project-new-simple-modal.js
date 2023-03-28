import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed, observer }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  session: service(),
  currentUser: service(),

  tagName: 'span',
  tab: null,
  open: null,
  project: null,
  challenge: null,
  newProject: null,
  projectId: null,
  user: null,
  displayStartsAt: null,
  displayEndsAt: null,
  newTitle: null,
  newChallengeName: null,
  newGoal: 50000,
  newStart: null,
  newEnd: null,
  
  
  init() {
    this._super(...arguments);
    let user = this.get('user');
    assert('Must pass a user into {{project-new-modal}}', user);
  },
  
  optionsForProjects: computed("currentUser.user.inactiveProjects", function () {
    let projects = this.get("currentUser.user.inactiveProjects");
    let ps = [];
    let needProjectId = true;
    //let pid = null;
    projects.forEach(function(p) {
      ps.push({id: p.id, title: p.title});
      if (needProjectId) {
        //pid = p.id;
        needProjectId = false;
      }
    });
    //this.set("projectId",pid);
    return ps;    
  }),
  
  defaultProjectCheck: observer("optionsForProjects.[]",function() {
    let projects = this.get("optionsForProjects");
    //console.log("triggered");
    this.set("projectId",projects[0].id);
  }),
  
  
  headerText: computed("challenge", function(){
    let challenge = this.get("challenge");
    let d = null;
    let month = null;
    // If this is an event
    if (challenge) {
      switch (challenge.eventType) {
        case 0:
          return "Join the November Challenge";
        case 1:
          d = moment(challenge.startsAt);
          month = d.format('MMMM');
          return "Join the " + month +" Camp Challenge";
        default:
          return "Join the challenge";
      }
    } else {
      // This is a personal challenge
      return "Start a new personal challenge";
    }
  }),
  
  isEvent: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      if ((challenge.eventType === 0)||(challenge.eventType === 1)) {
        return true;
      }
    }
    return false;
  }),
  
  isPersonal: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      return false;
    }
    return true;
  }),
  
  isFlexible: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      if (challenge.eventType == 0) {
        return false;
      }
    }
    return true;
  }),
  
  context: computed("isPersonal", "newProject", function() {
    let isPersonal = this.get("isPersonal");
    let newProject = this.get("newProject");
    if (isPersonal) {
      if (newProject) {
        return "personal-challenge-new-project";
      } else {
        return "personal-challenge-existing-project";
      }
    } else {
      if (newProject) {
        return "event-new-project";
      } else {
        return "event-existing-project";
      }
    }
  }),
  
  startLabel: computed('pastTense', function() {
    if (this.get('pastTense')) {
      return "What was your start date?"
    } else {
      return "What's your start date?"
    }
  }),
  
  durationLabel: computed('pastTense', function() {
    if (this.get('pastTense')) {
      return "When was the last day of writing?"
    } else {
      return "When is the last day of writing?"
    }
  }),
  
  invalidDates: computed('isPersonal', 'newStart', 'newEnd', function(){
    const isPersonal = this.get('isPersonal');
    const newStart = this.get('newStart');
    const newEnd = this.get('newEnd');
    if (isPersonal && newStart && newEnd && (newStart > newEnd)) {
      return true;
    }
    return false;
  }),
  
  disableButton: computed('newProject', 'isFlexible', 'isPersonal', 'newTitle', 'newChallengeName', 'newGoal', 'newStart', 'newEnd', 'invalidDates', function(){
    const newProject = this.get('newProject');
    const isFlexible = this.get('isFlexible');
    const isPersonal = this.get('isPersonal');
    const newTitle = this.get('newTitle');
    const newChallengeName = this.get('newChallengeName');
    const newGoal = this.get('newGoal');
    const newStart = this.get('newStart');
    const newEnd = this.get('newEnd');
    const invalidDates = this.get('invalidDates');
    // If present, is the title field filled in?
    if (!newTitle && newProject) {
      return true;
    }
    // If present, is the goal field filled in?
    if (!newGoal && isFlexible) {
      return true;
    }
    if (isPersonal) {
      // If present, are the date fields filled in?
      if (!newStart || !newEnd) {
        return true;
      }
      // If present, is the challenge name field filled in?
      if (!newChallengeName) {
        return true;
      }
    }
    // If present, is the start date on or before the end date?
    if (invalidDates) {
      return true;
    }
    // Otherwise, the form may be submitted
    return false;
  }),
  
  actions: {
    durationChanged(val) {
      this.set('newDuration', val);
      this.recomputeEndsAt();
    },
    endsAtChanged(val) {
      this.set('newEnd', val);
      //this.set('changeset.endsAt', val);
      //this.recomputeValidChallenge();

    },
    startsAtChanged(val) {
      this.set('newStart', val);
    },
    
    writingTypeChanged(val) {
      this.set('changeset.writingType', val);
      //this.set('projectChallenge.writingType', val);
    },
    
    unitTypeChanged(val) {
      this.set('projectChallenge.unitType', val);
    },
    
    goalChanged(val) {
      this.set('newGoal',val);
    },
    
    titleChanged(val) {
      this.set('newTitle',val);
    },
    
    challengeNameChanged(val) {
      this.set('newChallengeName',val);
    },
    
    projectSelect(selectValue) {
      this.set("projectId",selectValue);
    },
    
    onShow() {
      var t = document.getElementById("ember-bootstrap-wormhole");
      t.firstElementChild.setAttribute("aria-modal", "true");
      t.firstElementChild.setAttribute("aria-label", "Create a project");
    },
    onHidden() {
      this.set('open', null);
    },
    
    submitForm(event) {
      event.preventDefault();
      let p = {};
      let context = this.get("context");
      let newTitle = this.get("newTitle");
      let projectId = this.get("projectId");
      let challengeId = this.get("challenge.id");
      let newChallengeName = this.get("newChallengeName");
      let newGoal = this.get("newGoal");
      let newStart = this.get("newStart");
      let newEnd = this.get("newEnd");
      switch (context) {
      case "event-new-project":
        p = {context: context, title: newTitle, challenge_id: challengeId};
        break;
      case "event-existing-project":
        p = {context: context, project_id: projectId, challenge_id: challengeId};
        break;
      case "personal-challenge-new-project":
        p = {context: context, title: newTitle, challenge_name: newChallengeName, goal: newGoal, starts_at: newStart, ends_at: newEnd};
        break;
      case "personal-challenge-existing-project":
        p = {context: context, project_id: projectId, challenge_name: newChallengeName, goal: newGoal, starts_at: newStart, ends_at: newEnd};
        break;
      default:
        break;
      }
      let { auth_token }  = this.get('session.data.authenticated');
      let endpoint =  `${ENV.APP.API_HOST}/projects/create_from_simple_form`;
      return fetch(endpoint,{
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
        body: JSON.stringify(p),
      }).then((data)=>{
        if (data.ok) {
          this.set('open', null);
          let cu = this.get('currentUser');
          cu.load();
        }
      });
    },
    
    afterSubmit() {
      //hide the modal
      this.set('open', null);
      let as = this.get('afterSubmit');
      if (as) { as() }
    },
  }
});
