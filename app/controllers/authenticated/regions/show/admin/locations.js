import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  reorder: false,
  resize: true,
  homed: true,
  notHomed: true,
  loc: true,
  notLocation: true,
  rsvp: true,
  notRsvp: true,
  csvIsLoading: false,
  columns: computed(function() {
    const a = [
        {
          name: `Homed?`,
          valuePath: `homed`
        },
        {
          name: `Location`,
          valuePath: `location`
        },
        {
          name: `Last event RSVP`,
          valuePath: `rsvp`
        },
      ];
    return a;
  }),
  sorts: computed(function() {
    const a = [
        {
          valuePath: 'homed',
          isAscending: false,
        },
        {
          valuePath: 'location',
          isAscending: false,
        },
        {
          valuePath: 'rsvp',
          isAscending: false,
        },
      ];
    return a;
  }),
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.isLoaded',function() {
    if (this.get('currentUser.isLoaded')) {
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
  
  groupMembers: computed('model.listResults','homed','notHomed','loc','notLocation','rsvp','notRsvp',function() {
    const lr = this.get('model.listResults');
    let homed = this.get('homed');
    let loc = this.get('loc');
    let rsvp = this.get('rsvp');
    let notHomed = this.get('notHomed');
    let notLocation = this.get('notLocation');
    let notRsvp = this.get('notRsvp');
    let a = [];
    for (const [key, value] of Object.entries(lr)) {
      let c = value[0];
      let h = (c.homed == "Yes");
      let l = (c.location != null);
      let r = (c.rsvp != null);
      if (key && ((h==homed)||(!h==notHomed)) && ((l==loc)||(!l==notLocation)) && ((r==rsvp)||(!r==notRsvp))) {
        a.push(c);
      }
    }
    return a;
  }),

  escapeString(str) {
    if (str!=null) {
      return str.replace('"','""');
    } else {
      return '';
    }
  },
  
  generateCSV() {
    let t = this;
    let csv = 'Homed?, Location, Last event RSVP\n';
    let groupMembers = this.get('groupMembers');
    groupMembers.forEach(function(c) {
      csv += c.homed;
      csv += ',';
      csv += '"' + t.escapeString(c.location) + '"';
      csv += ',';
      if (c.rsvp) {
        csv += c.rsvp;
      } else {
        csv += '';
      }
      csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'region-locations.csv';
    hiddenElement.click();
    this.set('csvIsLoading', false);
  },

  actions: {
        
    associateHomedSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('homed',(sv>-1));
      this.set('notHomed',(sv<1));
    },
    
    associateLocationSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('loc',(sv>-1));
      this.set('notLocation',(sv<1));
    },
    
    associateRsvpSelect(selectValue) {
      let sv = parseInt(selectValue);
      this.set('rsvp',(sv>-1));
      this.set('notRsvp',(sv<1));
    },
    
    downloadCSV() {
      this.set('csvIsLoading', true);
      this.generateCSV();
    }
  }
  
});
