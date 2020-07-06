import Service from '@ember/service';

export default Service.extend({
  
  displaySessionForm: false,
  displayTimerForm: false,
  defaultProjectId: null,
  
  // Opens the progress updater
  toggleSessionForm(projectId) {
    //alert(projectId);
    if (this.get('displaySessionForm')) {
      this.set('displaySessionForm', false);
      this.set('defaultProjectId', null);
    } else {
      this.set('defaultProjectId', projectId);
      this.set('displaySessionForm', true);
      this.set('displayTimerForm', false);
    }
  },
  
  // Hides both forms
  hideForms() {
    this.set('displaySessionForm', false);
    this.set('displayTimerForm', false);
    this.set('defaultProjectId', null);
  },
  
  setDefaultProjectId(id) {
    this.set('defaultProjectId', id);
  },
  
});
