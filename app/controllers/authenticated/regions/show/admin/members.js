import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  activeTab: 'members',
  reorder: false,
  resize: true,
  homed: true,
  notHomed: true,
  updated: true,
  notUpdated: true,
  csvIsLoading: false,
  displayDownloadLoading: "display: none;",
  columns: computed(function() {
    const a = [
        {
          name: `User`,
          valuePath: `name`
        },
        {
          name: `Signed up`,
          valuePath: `joined_site`
        },
        {
          name: `Joined region`,
          valuePath: `joined_region`
        },
        {
          name: `Last login`,
          valuePath: `sign_in`
        },
        {
          name: `Homed?`,
          valuePath: `homed`
        },
        {
          name: `Last update`,
          valuePath: `last_update`
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
          valuePath: 'joined_site',
          isAscending: false,
        },
        {
          valuePath: 'joined_region',
          isAscending: false,
        },
        {
          valuePath: 'sign_in',
          isAscending: false,
        },
        {
          valuePath: 'homed',
          isAscending: false,
        },
        {
          valuePath: 'last_update',
          isAscending: false,
        },
      ];
    return a;
  }),
  
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
  
  groupMembers: computed('model.listResults','homed','notHomed','updated','notUpdated',function() {
    const lr = this.get('model.listResults');
    let homed = this.get('homed');
    let updated = this.get('updated');
    let notHomed = this.get('notHomed');
    let notUpdated = this.get('notUpdated');
    let a = [];
    for (const [key, value] of Object.entries(lr)) {
      let c = value[0];
      let h = (c.homed == "Yes");
      let u = (c.last_update != null);
      if (key && ((h==homed)||(!h==notHomed)) && ((u==updated)||(!u==notUpdated))) {
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
    let csv = 'User, Signed up, Joined region, Last login, Homed?, Last update\n';
    let groupMembers = this.get('groupMembers');
    groupMembers.forEach(function(c) {
      csv += '"' + t.escapeString(c.name) + '"';
      csv += ',';
      csv += c.joined_site;
      csv += ',';
      csv += c.joined_region;
      csv += ',';
      csv += c.sign_in;
      csv += ',';
      csv += c.homed;
      csv += ',';
      if (c.last_update) {
        csv += c.last_update;
      } else {
        csv += '';
      }
      csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'members.csv';
    hiddenElement.click();
    this.set('csvIsLoading', false);
  },
  
  actions: {
        
    associateHomedSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('homed',(sv>-1));
      this.set('notHomed',(sv<1));
    },
    
    associateUpdateSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('updated',(sv>-1));
      this.set('notUpdated',(sv<1));
    },
    
    downloadCSV() {
      this.set('csvIsLoading', true);
      this.generateCSV();
      //setTimeout(() => {  this.generateCSV(); }, 1000);
    }
    
  }
});
