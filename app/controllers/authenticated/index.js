import Controller from '@ember/controller';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import moment from 'moment';

export default Controller.extend({
  currentUser: service(),
  router: service(),
  displayDonationDayBanner: false,
  
  currentUserName: reads('currentUser.user.name'),
  currentUserEmail: reads('currentUser.user.email'),
  currentUserIsNotConfirmed: reads('currentUser.user.isNotConfirmed'),
  currentUserHasProject: computed('currentUser.user.projects.{[],@each.primary}', function() {
    let cu = this.get('currentUser.user');
    if (cu) {
      return cu.persistedProjects.length > 0;
    }
  }),
  primaryProject: computed("currentUser.user.primaryProject", function(){
    let p = this.get('currentUser.user.primaryProject');
    return p;
  }),
  
  queryParams: ['addProject'],
  
  addProject: false,
  
  init(){
    this._super(...arguments);
    //check if the donationDayBanner should be displayed
    this._checkDonationDayTime();
  },
  
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
  },
  _checkDonationDayTime(){
    let startTime = "2019-11-09 00:00";
    let endTime = "2019-11-09 23:59";
    //rerun this method every minutes
    later(this, "_checkDonationDayTime", 60000);
    let time = moment.tz(moment(), 'America/Los_Angeles').format('YYYY-MM-DD HH:mm');
    if (time >= startTime && time <=endTime) {
      this.set('displayDonationDayBanner', true);
    } else {
      this.set('displayDonationDayBanner', false);
    }
  }
});
