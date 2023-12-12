import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
	currentUser: service(),
  year: null,
  annualStats: null,
  
	otherYears: computed('currentUser.user.yearsDone','year', function(){ 
		// get the current user
		var user = this.get('currentUser.user');
		// an array for the list of other years the user has participated
		var otherYears = [];
		if (user) {
			var targetYear = this.get('year');
			user.yearsDone.forEach((year) => {
				if (year !== targetYear) {
					otherYears.push(year);
				}
			});
		}
		// sort otherYears in reverse cron order
		otherYears = otherYears.sort().reverse();
		return otherYears;
	}),

	hasOtherYears: computed('otherYears', function(){	
		let oy = this.get('otherYears');
		return oy.length > 0;
	}),
	
	pageTitle: computed('year', function() {
		return "Year-In-Review "+this.get('year');
	})
});


