import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model.group'),
  activeTab: 'members',
  reorder: false,
  resize: true,
  homed: true,
  notHomed: true,
  win: true,
  notWin: true,
  csvIsLoading: false,
  columns: computed(function() {
    const a = [
        {
          name: `User`,
          valuePath: `name`
        },
        {
          name: `Homed?`,
          valuePath: `homed`
        },
        {
          name: `Win?`,
          valuePath: `win`
        },
        {
          name: `Word Count`,
          valuePath: `wordcount`
        },
        {
          name: `Goal`,
          valuePath: `goal`
        },
        {
          name: `Last update`,
          valuePath: `update`
        },
      ];
    return a;
  }),
  sorts: computed(function() {
    const a = [
        {
          valuePath: 'name',
          isAscending: false,
        },
        {
          valuePath: 'homed',
          isAscending: false,
        },
        {
          valuePath: 'win',
          isAscending: false,
        },
        {
          valuePath: 'wordcount',
          isAscending: false,
        },
        {
          valuePath: 'goal',
          isAscending: false,
        },
        {
          valuePath: 'update',
          isAscending: false,
        },
      ];
    return a;
  }),
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  // Gets all challenges from the store
  availableOptionsForChallenges:  computed('getChallengeOptions', function() {
    return this.get('store').query('challenge',{ available: false});
  }),
 
  optionsForChallenges: sort('availableOptionsForChallenges','challengeSortingDesc'),
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.user.groupUsersLoaded',function() {
    if (this.get('currentUser.user.groupUsersLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        let found = false;
        gus.forEach((gu)=>{
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
            found = true;
          }
        });
        return found;
      }
    } else {
      return false;
    }
  }),
  
  numRows: computed('groupMembers',function() {
    const lr = this.get('groupMembers');
    return lr.length;
  }),
  
  groupMembers: computed('model.listResults','homed','notHomed','win','notWin',function() {
    const lr = this.get('model.listResults');
    let homed = this.get('homed');
    let win = this.get('win');
    let notHomed = this.get('notHomed');
    let notWin = this.get('notWin');
    let a = [];
    for (const [key, value] of Object.entries(lr)) {
      let c = value[0];
      let h = (c.homed == "Yes");
      let w = (c.win == "Yes");
      if (key && ((h==homed)||(!h==notHomed)) && ((w==win)||(!w==notWin))) {
        a.push(c);
      }
    }
    return a;
  }),
  
  escapeString(str) {
    let n = str.replace(/(<([^>]+)>)/gi, "");
    n = n.replace('"','""');
    return n;
  },
  
  generateCSV() {
    let t = this;
    let csv = 'User, Homed?, Win?, Word Count, Goal, Last update\n';
    let groupMembers = this.get('groupMembers');
    groupMembers.forEach(function(c) {
      csv += '"' + t.escapeString(c.name) + '"';
      csv += ',';
      csv += c.homed;
      csv += ',';
      csv += c.win;
      csv += ',';
      csv += c.wordcount;
      csv += ',';
      csv += c.goal;
      csv += ',';
      if (c.update) {
        csv += c.update;
      } else {
        csv += '';
      }
      csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'region-writing.csv';
    hiddenElement.click();
    this.set('csvIsLoading', false);
  },
  
  actions: {
    
    /*associateChallengeSelect(challengeId) {
      this.get('router').transitionTo('authenticated.regions.show.admin.writing.show', this.get('group.slug'), challengeId );
    },*/
    
    associateHomedSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('homed',(sv>-1));
      this.set('notHomed',(sv<1));
    },
  
    associateWinSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('win',(sv>-1));
      this.set('notWin',(sv<1));
    },
  
    downloadCSV() {
      this.set('csvIsLoading', true);
      this.generateCSV();
    }
  
  
  }
  
});
