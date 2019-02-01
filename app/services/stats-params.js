import Service from '@ember/service';

export default Service.extend({
  project: null,
  projectChallenge: null,
  
  setProject: function(value) {
    this.set('project', value);
  },
  getProject: function(){
    return this.get('project');
  },
  setProjectChallenge: function(value) {
    this.set('projectChallenge', value);
  },
  getProjectChallenge: function(){
    return this.get('projectChallenge');
  },
  clear: function(){
    //set project and projectChallenge to null
    this.setProject(null);
    this.setProjectChallenge(null);
  },
  hasData: function() {
    //check to see if there are values for p and pc
    return (this.get('project') && this.get('projectChallenge') );      
  }
  
});
