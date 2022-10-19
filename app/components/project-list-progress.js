import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  progressUpdaterService: service(),
  router: service(),
  
  project: null,
  
  winnerRoute: computed('project.currentProjectChallenge.eventType', function() {
    let type = this.get('project.currentProjectChallenge.eventType');
    if (type < 2 || type==3){ // event is NaNoWriMo or Camp
      // get the event name 
      let name = this.get('project.currentProjectChallenge.name');
      if (name && this.get('goalMet')) {
        // convert the name
        name = name.toLowerCase().replace(/ /g,"-")+"-winner";
        // return the route
        let route = `authenticated.${name}`;
        let router = this.get('router');
        try {
          router.urlFor( route );  // if this fails, no route exists
          return route;
        } catch (error) {
          // bummer
        }
      }
    }
    return null;
  }),
  
  
  writingTypeString: computed('project.currentProjectChallenge.writingType',function() {
    let t = this.get('project.currentProjectChallenge.writingType');
    if (t==1) {
      return "Edit";
    } else {
      return "Write";
    }
  }),
  
  formattedLabel: computed("project.currentProjectChallenge.id", function(){
    let pc = this.get('project.currentProjectChallenge');
    if (pc) {
      if (moment(pc.startsAt)>moment()) {
        return "Starts";
      } else {
        return "Started";
      }
    }
    return '';
  }),
  
  formattedStart: computed("project.currentProjectChallenge.id", function(){
    let pc = this.get('project.currentProjectChallenge');
    if (pc) {
      let time = moment(pc.startsAt);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return time.format("MMM YYYY");
      } else {
        return time.format("MMM. YYYY");
      }
    }
    return '';
  }),
  
  goalMet: computed("percentCompleted", function(){
    return this.get('percentCompleted') === 100;
  }),

  percentCompleted: computed("project.currentProjectChallenge.{goal,count}",'project.computedProjectChallenges.[]',function(){
    let proj = this.get('project');
    if (proj) {
      let pc = proj.currentProjectChallenge;
      if (pc) {
        let wc = proj.currentProjectChallenge.count;
        let g = proj.currentProjectChallenge.goal;
        let percent = wc*100/g;
        if (percent > 100) {
          percent = 100;
        }
        return percent;
      }
    }
    return 0;
  }),
  
  goalIcon: computed("project.currentProjectChallenge.eventType",function(){
    let str = '';
    let et = this.get('project.currentProjectChallenge.eventType');
    if (et==0) {
      str = "<img src='/images/global/helmet.svg' style='' />";
    }
    if (et==1) {
      str = "<img src='/images/global/tent.svg' style='' />";
    }
    if (et==3) {
      str = "<img src='/images/global/now-what-pen.svg' style='' />";
    }
    return str;
  }),
  
  actions: {
    
    toggleProgressUpdater() {
      let pus = this.get('progressUpdaterService');
      let p = this.get('project');
      pus.toggleSessionForm(p.id);
    },
    
    viewGoals() {
      this.get('router').transitionTo('authenticated.users.show.projects.show.goals', this.get('project.computedAuthor.slug'), this.get('project.slug') );
    }
    
  }
  
});
