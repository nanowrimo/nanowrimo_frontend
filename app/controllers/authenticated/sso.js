import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  queryParams: ['sig', 'sso'],
  init() {
    this._super(...arguments);
    //add an observer to the model
    this.addObserver('model', this, 'modelDidChange');
  },
  //the route model hook has completed and we can now access all service data
  modelDidChange(){
    console.log(this.get('currentUser.user.name'));
  }
});
