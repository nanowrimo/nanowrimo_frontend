import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
export default Controller.extend({
  currentUser: service(),
  queryParams: ['addGoal'],
  addGoal: false,
  
  user: null,
  
  //newProjectChallenge: false,
  
  filterType: 0,
  
  canAddProject: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),
  
  filteredProjectChallenges: computed('project', 'filterType', function(){
      let ft = this.get('filterType');
      if (ft==0) {
        //show all
        return this.get('projectChallenges');
      } else {
        let array = [];
        let now = moment();
        //get the projectChallenges and loop through them
        let pcs = this.get('projectChallenges');
        pcs.forEach((pc)=>{
          let end = moment(pc.endsAt);
          if (ft==1) {
            //hasn't ended
            if (now.isSameOrBefore(end) ){
              array.push(pc);
            }
          } else {
            //ended 
             if (now.isAfter(end) ){
              array.push(pc);
            }
          }
          
        });
        return array;
      }
  }),
  
  canAddProjectChallenge: computed('project.computedAuthor','currentUser.user', function(){
    //get the project and the user
    let a = this.get('project.computedAuthor');
    let u = this.get('currentUser.user');
    return (a == u);
  }),
  
  projectChallenges: computed('project', 'project.projectChallenges.[]', function(){
    return this.get('project.projectChallenges');
  }),
  


  init(){
    this._super(...arguments);
    
  },

  actions: {
    newProjectChallenge(){
      this.set('addGoal', true);
    },
    filterChanged(v){
      this.set('filterType', parseInt(v));
    }
    
  }
});
