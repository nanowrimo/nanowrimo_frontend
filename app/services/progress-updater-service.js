import Service from '@ember/service';

export default Service.extend({
  
  displaySessionForm: false,
  displayTimerForm: false,
  defaultProjectId: null,
  
  // Opens the progress updater
  // If projectId is specified, make that the default
  toggleSessionForm() {
    if (this.get('displaySessionForm')) {
      this.set('displaySessionForm', false);
      this.set('defaultProjectId', null);
    } else {
      this.set('defaultProjectId', projectId);
      this.set('displaySessionForm', true);
      this.set('displayTimerForm', false);
    }
  },

  toggleTimerForm() {
    if (this.get('displayTimerForm')) {
      this.set('displayTimerForm', false);
    } else {
      this.set('displaySessionForm', false);
      this.set('displayTimerForm', true);
    }
  },
  
  // Hides both forms
  hideForms() {
    this.set('displaySessionForm', false);
    this.set('displayTimerForm', false);
    this.set('defaultProjectId', null);
  },
  
});
