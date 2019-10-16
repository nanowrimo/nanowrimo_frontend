import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
export default Controller.extend({
  currentUser: service(),
  
  newProjectChallenge: false,
  
  filterType: 0,
  
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
  
  canAddProjectChallenge: computed("project", function(){
    //get the project and the user
    let p = this.get('project');
    let u = this.get('currentUser.user');
    return (p.user_id == u.id);
  }),
  
  projectChallenges: computed('project', 'project.projectChallenges.[]', function(){
    return this.get('project.projectChallenges');
  }),
  


  init(){
    this._super(...arguments);
    
  },

  actions: {
    newProjectChallenge(){
      this.set('newProjectChallenge', true);
    },
    filterChanged(v){
      this.set('filterType', parseInt(v));
    }
    
  }
});
