import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
	currentUser: service(),
  year: null,
  annualStats: null,
  
	otherYears: computed('currentUser.user.yearsDone','year', function(){ 
		var user = this.get('currentUser.user');
		if (user) {
			var targetYear = this.get('year');
			var otherYears = [];
			user.yearsDone.forEach((year) => {
				if (year !== targetYear) {
					otherYears.push(year);
				}
			});
			return otherYears;
		}
	}),

	hasOtherYears: computed('otherYears', function(){	
		let oy = this.get('otherYears');
		return oy.length > 0;
	})
});


