import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  queryParams: ['sig', 'sso'],
  hasModelError: false,
  
  init() {
    this._super(...arguments);
    //add an observer to the model
    this.addObserver('model', this, 'modelDidChange');
  },
  //the route model hook has completed and we can now access the model
  modelDidChange(){
    let model = this.get('model');
    //is there an error?
    if (model.error) {
      this.set('hasModelError', true);
    } else {
      //get the discourse sso url
      let url = model.data.ssoUrl;
      //redirect the browser to the url
      window.location.replace(url);
    }
  }
});
