import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
export default Controller.extend({

  project: alias('model'),
  
  hasDetails: computed("model", function(){
    //what constitutes 'details'? 
    return false;
  }),
  
  actions: {
    editProject() {
      //console.log('edit project');
    }
  }

  
});
