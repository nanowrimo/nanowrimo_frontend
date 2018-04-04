import ApplicationAdapter from './application';
import AdaptersUuidMixin from 'ember-cli-uuid/mixins/adapters/uuid';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

export default ApplicationAdapter.extend(AdaptersUuidMixin, {
  session: service(),

  createRecord(store, type, snapshot) {
    let { email, password } = get(snapshot, '_attributes');
    return new Promise ((resolve, reject) => {
      return this.get('session').authenticate('authenticator:nanowrimo', email, password)
      .then(() => {
        resolve();
      })
      .catch((json) => {
        reject(get(json, 'error'));
      });
    });
  }
});
