import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
	currentUser: service(),
  year: null,
  annualStats: null,
  
	allYears: computed('currentUser.user.allYearsWriting.[]','year', function(){ 
		// get the current user
		var user = this.get('currentUser.user');
		// an array for the list of other years the user has participated
		var allYears = [];
		if (user) {
			allYears = user.allYearsWriting;
			console.log(allYears);
		}
		// sort allYears in reverse cron order
		allYears = allYears.sort().reverse();
		return allYears;
	}),

	hasAllYears: computed('allYears', function(){	
		let oy = this.get('allYears');
		return oy.length > 0;
	}),
	
	pageTitle: computed('year', function() {
		return "Year-In-Review "+this.get('year');
	})
});


