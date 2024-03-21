import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';
import { computed } from '@ember/object';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,
  email: null,
  isLoaded: false,
  groupUsersLoaded: false,
  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user',
      { current: true, include: 'projects,timers,stopwatches'}).then((user) => {
        this.set('email', user.email);
        this.set('user', user);
        this.set('isLoaded', true);
        user.loadHomeRegion();
        //get the current user's projects
        return this.get('store').query('project',
        {
          filter: { user_id: user.id },
          include: 'genres,challenges,project-challenges'
        }).then(() => {
            // do nothing?
        });
      });
    } else {
      return resolve();
    }
  },
  

  // should social items be displayed?
  displayForumsAndRegions: computed("user.{isNotConfirmed,over18}", function(){
		let user = this.get('user');
		if (user) {
			let notConfirmed = this.get('user.isNotConfirmed');
			let over18 = this.get('user.over18');
			return (!notConfirmed && over18);
		} else {
			return false;
		}
	}),
  
});
