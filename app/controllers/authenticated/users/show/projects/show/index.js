import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
export default Controller.extend({

  project: alias('model'),
  
  hasDetails: computed("project", function(){
    //what constitutes 'details'? 
    let p = this.get('project');
    return (p.summary!=null || p.excerpt!=null);
  })
});