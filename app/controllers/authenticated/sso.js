import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  queryParams: ['sig', 'sso'],

  init(){
    this._super(...arguments);
    let cu = this.get('currentUser');
    let user = cu.get('user');
    console.log(cu);  
    console.log(user);
  }
});
