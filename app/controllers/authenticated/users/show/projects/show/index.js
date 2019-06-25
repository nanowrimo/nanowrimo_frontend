import Controller, {inject as controller} from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  projectShow: controller("authenticated.users.show.projects.show"),
  project: alias('model'),
  
  hasDetails: computed("project.{summary,excerpt,pinterestUrl,playlistUrl}", function(){
    //what constitutes 'details'? 
    let p = this.get('project');
    return (p.cover || p.summary || p.excerpt || p.pinterestUrl || p.playlistUrl);
  }),
  canEdit: computed('author','currentUser.user', function(){
    let a = this.get('author');
    let cu = this.get('currentUser.user');
    return a==cu;
  }),
  
  actions: {
    editProject(){
      //send it the 'editProject' action
      this.get('projectShow').send('editProject');
    },
    editCover(){
      //send it the 'editProject' action
      this.get('projectShow').send('editCover');
    }
  }
  
});
