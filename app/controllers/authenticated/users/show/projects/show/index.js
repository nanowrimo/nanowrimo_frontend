import Controller, {inject as controller} from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
export default Controller.extend({
  projectShow: controller("authenticated.users.show.projects.show"),
  project: alias('model'),
  
  hasDetails: computed("project.{summary,excerpt,pinterestUrl,playlistUrl}", function(){
    //what constitutes 'details'? 
    let p = this.get('project');
    return (p.summary || p.excerpt || p.pinterestUrl || p.playlistUrl);
  }),
  
  actions: {
    editProject(){
      //send it the 'editProject' action
      this.get('projectShow').send('editProject');
    }
  }
  
});
