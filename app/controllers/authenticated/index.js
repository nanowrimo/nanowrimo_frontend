import Controller from '@ember/controller';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),
  currentUserEmail: reads('currentUser.user.email'),
  currentUserIsNotConfirmed: reads('currentUser.user.isNotConfirmed'),
  
});
