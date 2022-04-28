import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  queryParams: ['ps'],
  regions: null,
  currentUser: service()
});
