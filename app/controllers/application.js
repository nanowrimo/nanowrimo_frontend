import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
 
export default Controller.extend({
  session: service(),
  router: service(),
  media: service(), 
  currentUser: service(),
  version: service(),
  agreedToTerms: null,
  
  init(){
    this._super(...arguments);
    this.set('isLoading', true);
    // get the initial value of the agreed to terms
    this.set('agreedToTerms', this.get('currentUser.user.agreedToTerms'));
  },
  
  observerUserTermsAgreement: observer('currentUser.{user.agreedToTerms,isLoaded}', function(){
		let loaded = this.get('currentUser.isLoaded');
		if (loaded) {
			let agreedToTerms = this.get('currentUser.user.agreedToTerms');
			if (!agreedToTerms) {
				this.get('router').transitionTo('authenticated.agree-to-terms');
			}
		}
	}),
  // which routes should display navigation? 
  show_navigation: computed('routeName', function() {
    let no_nav_routes = ["sign-in","sign-up","forgot-password","password-reset",'unsubscribe','authenticated.agree-to-terms'];
    //let rn = this.get('routeName');
    let rn = this.get('router').get('currentRouteName'); 
    console.log(rn);
    return !no_nav_routes.includes(rn);
  }),
  show_footer: computed('routeName', function() {
    let no_footer_routes = ["authenticated.nanomessages.index","authenticated.nanomessages.show.index"];
    //let rn = this.get('routeName');
    let rn = this.get('router').get('currentRouteName');
    let body = document.body;
    let t = no_footer_routes.includes(rn);
    if (t) {
      body.classList.add("full-screen");
    } else {
      body.classList.remove("full-screen");
    }
    return !t;
  }),
  is_authenticated: computed('session.isAuthenticated', function() {
    if (this.get('session.isAuthenticated')) {
      return true;
    } else {
      return false;
    }
  }),
  observeLoading: observer('isLoading', function(){
    let loading = this.get('isLoading');
    // if loading is now false...
    if (!loading) {
      // remove the loading-indicator from the dom
      let element = document.getElementById('application-loading-indicator');
      if (element) {
        element.remove();
      }
    }
  }),
  UiOutdated: computed('version.outdated', function(){
    return this.get('version.outdated');
  }),
  
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },   
    reloadUI() {
      window.location.reload();
    }
  }
});
