import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  session: service(),
  router: service(),
  media: service(),
  
  // which routes should display navigation? 
  show_navigation: computed('routeName', function() {
    let no_nav_routes = ["sign-in","sign-up","forgot-password","password-reset",'unsubscribe'];
    //let rn = this.get('routeName');
    let rn = this.get('router').get('currentRouteName');
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
  //routeName: computed('currentPath', function() {
    //return this.get('currentPath');
  //}),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },    
  }
});
