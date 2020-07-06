import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  store: service(),
  session: service(),
  currentUser: service(),
  recalculate: 0,
  // Get the project challenge as a variable
  projectChallenge: null,
  newProjectSession: false,
  reimportHistory: false,
  showConfirmReimport: false,
  reimportConfirmationTitleText: null,
  reimportConfirmationYesText:null,
  reimportConfirmationNoText:null,
  reimportConfirmationQuestion: null,
  reimportConfirmationQuestionAddendum: null,
  
  sessions: null,
  
  init(){
    this._super(...arguments);
    this.set('reimportConfirmationTitleText', "Confirm Import");
    this.set('reimportConfirmationQuestion', `Import past data?`);
    this.set('reimportConfirmationQuestionAddendum', "<p>Importing your history will check our database for all previous progress updates associated with this goal. Any existing data will then be added to your progress updates here.</p><p>Note that this won't rewrite or remove any of your existing updates—it will add historical data. You may end up with duplicate updates for you to delete as needed.</p>");
    this.set('reimportConfirmationYesText','Add My Past Updates'); 
    this.set('reimportConfirmationNoText','Cancel'); 
    this.fetchSessions(true);
  },
  
  // To determine whether to show the re-import link
  importable: computed('projectChallenge.challenge_id',function() {
    let i = this.get('projectChallenge.challenge_id');
    // if this is from any of the events prior to the new website
    if ((i>100 && i<121) || (i>200 && i<220)) {
      return true;
    } else {
      return false;
    }
  }),
  
  progressUpdates: computed('sessions.[]', function() {
    let pss = this.get('sessions');
    return pss;
  }),
  
  updateSortingAsc: Object.freeze(['end:desc']),
  sortedUpdates: sort('progressUpdates','updateSortingAsc'),
  
  doRecalculate() {
    let r = this.get('recalculate');
    let newr = r + 1;
    this.set('recalculate',newr);
  },
  
  goalStartMonthDay: computed("projectChallenge", function(){
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    //get the project challenge start
    let start = this.get('projectChallenge.startsAt');
    //split the date into YYYY MM DD
    let splitStart = start.split("-");
    //determine the month index, it is splitStart[1]-1
    let index = splitStart[1]-1;
    let monthName = monthNames[index];
    let day = parseInt(splitStart[2])
    
    return `${monthName} ${day}`;
    
    
  }),
  
  fetchSessions: function(initial) {
    let store = this.get('store');
    let pc = this.get('projectChallenge');
    let options = {projectChallengeId: pc.id, limit: 5};
    if (!initial) {
      // what is the oldest end?
      let sessions = this.get('sortedUpdates');
      let last = sessions.lastObject;
      // add the oldest end to the options as a unix timestamp... in UTC
      options.oldestEnd = last.end.getTime()/1000 + (last.end.getTimezoneOffset() * 60);
    }
    // from the api, request 50 project sessions
    return store.query('project-session', options);
  },
  
  actions: {
    fetchSessions() {
      this.fetchSessions();
    },
    
    userDidChangeProjectSession() {
      this.doRecalculate();
      /*/reload the projectChallenge
      let store = this.get('store');
      let pc = this.get('projectChallenge');
      return store.findRecord('projectChallenge', pc.id); 
      */
    },
    
    newProjectSession(){
      this.set('newProjectSession', true);
    },
    
    importHistory(){
      this.set('reimportHistory', true);
    },
    
    confirmReimport() {
      this.set('showConfirmReimport', true);
    },
    
    reimportConfirmationYes() {
      //hide the dialog
      this.set('showConfirmReimport', false);
      let cid = this.get('projectChallenge.challenge_id');
      let endpoint =  `${ENV.APP.API_HOST}/reimport_history/` + cid;
      let { auth_token } = this.get('session.data.authenticated');
      return fetch(endpoint, {
        headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
      }).then(()=>{
        alert('Your data has been imported!');
        let cu = this.get('currentUser');
        cu.load();
      });
    },
    
    reimportConfirmationNo() {
       this.set('showConfirmReimport', false);
    },
  }
});
