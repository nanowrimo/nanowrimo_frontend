import ApplicationAdapter from './application';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

export default ApplicationAdapter.extend( {
  session: service(),

  createRecord(store, type, snapshot) {
    let { identifier, password } = get(snapshot, '_attributes');
    return new Promise ((resolve, reject) => {
      return this.get('session').authenticate('authenticator:nanowrimo', identifier, password)
      .then(() => {
        resolve();
      })
      .catch((json) => {
        reject(get(json, 'error'));
      });
    });
  }
});
