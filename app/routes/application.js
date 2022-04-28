import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  currentUser: service(),
  pingService: service(),
  badgesService: service(),
  session: service(),
  //include the airbrake service 
  airbrake: service(),
  
  routeAfterAuthentication: 'authenticated',

  init(){
    this._super(...arguments);
    //access the airbrake service... if it exists in the ENV
    if (ENV.airbrake) {
      let airbrake = this.get('airbrake');
      //add a filter to parse notices
      airbrake.addFilter(function(notice){
        //default to sending the notice 
        let sendNotice = true;
        //loop through the notice errors
        notice.errors.forEach(err=>{
          //loop through the ignoreMessageStrings
          ENV.airbrake.ignoreMessageStrings.forEach(ims=>{
            if (err.message.includes(ims)) {
              //there was a match, do not send 
              sendNotice = false;
            }
          });
        });
        //should the notice be sent?
        if (sendNotice) {
          return notice;
        }else{
          return null;
        }
      });
    }
  },

  beforeModel() {
    //this._loadPingService();
    //this._loadBadgesService();
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
    this._loadPingService();
    this._loadBadgesService();
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  },
  _loadPingService() {
    return this.get('pingService').load();
  },
  _loadBadgesService() {
    return this.get('badgesService').load();
  },
  _loadNotificationsService() {
    return this.get('notificationsService').load();
  },

  actions: {
    async loading(transition, originRoute) {  // eslint-disable-line no-unused-vars
      let controller = this.controllerFor('application');
      controller.set('isLoading', true);
      transition.promise.finally(function() {
          controller.set('isLoading', false);
      });
    },
    error(error, transition) { // eslint-disable-line no-unused-vars
      if (error.errors) {
        let firstError = error.errors[0];
        if (firstError.status == 404) {
          this.intermediateTransitionTo('404');
        } else {
          this.intermediateTransitionTo('error');
        }
      } else {
        this.intermediateTransitionTo('error');        
      }
      
      return true;
    }
  }
});
