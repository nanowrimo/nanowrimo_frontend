import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  currentUser: service(),
  badgesService: service(),
  session: service(),
  
  routeAfterAuthentication: 'authenticated',

  beforeModel() {
    this._loadBadgesService();
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadBadgesService();
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  },
  _loadBadgesService() {
    return this.get('badgesService').load();
  },

  actions: {
    error(error, transition) { // eslint-disable-line no-unused-vars
      if (error.errors) {
        let firstError = error.errors[0];
        if (firstError.status == 404) {
          this.intermediateTransitionTo('404');
        } else {
          this.intermediateTransitionTo('error');
        }
      }

      return true;
    }
  }
});
