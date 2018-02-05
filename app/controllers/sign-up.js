import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  user: alias('model'),

  actions: {
    createUser() {
      let user = this.get('user');
      user.save();
    }
  }
});
