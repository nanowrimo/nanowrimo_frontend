import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  store: service(),
  currentUser: service(),
  statsParams: service(),
  router: service(),
  editProjectChallenge: false,
  showConfirmDelete: false,
  group: null,
  event: null,
  classNames: ['nw-card','event-card'],
  canEdit: computed('project', function(){
    let currentUser = this.get('currentUser.user');
    let author = this.get('author');
    return currentUser === author;
  }),
  
  svg: computed('projectChallenge', function() {
    let str = (this.get('projectChallenge.unitType') === 0) ? 'writing' : 'editing';
    return `/images/goals/${str}.svg`
  }),
  
  init() {
    this._super(...arguments);
    this.set('deleteConfirmationYesText', 'Delete');
    this.set('deleteConfirmationNoText', 'Cancel'); 
    this.set('deleteConfirmationTitleText', 'Confirm Delete');
    this.set('deleteConfirmationQuestion', `Do you really want to delete the "${name}" goal?`);
  },
  
  // Returns the start date as a readable string
  startDateTime: computed(function() {
    return moment(this.get('event.startDt')).format("dddd, MMMM D, YYYY") + ", from " + moment(this.get('event.startDt')).format("h:mm a") + " to " + moment(this.get('event.endDt')).format("h:mm a");
  }),
  
  // Returns the start date as a readable string
  startMo: computed(function() {
    return moment(this.get('event.startDt')).format("MMM");
  }),

  // Returns the start date as a readable string
  startDate: computed(function() {
    return moment(this.get('event.startDt')).format("d");
  }),
  
  locationAddress: computed('event',function() {
    let store = this.get('store');
    let lgs = store.peekAll('location_group');
    let e = this.get('event');
    let id = e.id;
    let s = null;
    lgs.forEach((lg) => {
      if ((id==lg.group_id)&&(lg.primary==1)&&(lg.id != null)) {
        let l = store.peekRecord('location',lg.location_id);
        if (l) {
          s = l.formatted_address;
        }
      }
    });
    return s;
  }),
  
  locationName: computed('event',function() {
    let store = this.get('store');
    let lgs = store.peekAll('location_group');
    let e = this.get('event');
    let id = e.id;
    let s = null;
    lgs.forEach((lg) => {
      if ((id==lg.group_id)&&(lg.primary==1)&&(lg.id != null)) {
        let l = store.peekRecord('location',lg.location_id);
        if (l) {
          s = l.name;
        }
      }
    });
    return s;
  }),
  
  actions: {
    editProjectChallenge(){
       this.set('editProjectChallenge', true);
    },

    confirmDelete(){
      //show the delete dialog
      this.set('showConfirmDelete', true);
    },
    
    deleteConfirmationYes(){
      //TODO: delete this projectChallenge
      //get the projectChallenge 
      this.get('projectChallenge').destroyRecord();
      //close the modal
      this.set('showConfirmDelete', false);
    },
    deleteConfirmationNo(){
      //close the modal
      this.set('showConfirmDelete', false);
    },
    redirectToStats(){
      //get the statsParams service
      let sp = this.get('statsParams');
      //set project and projectChallenge
      sp.setProject(this.get('project'));
      sp.setProjectChallenge(this.get('projectChallenge'));
      //do the redirect
      this.get('router').transitionTo('/stats');
    }
  }
});
