import ApplicationAdapter from './application';
import AdaptersUuidMixin from 'ember-cli-uuid/mixins/adapters/uuid';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';
import { Promise } from 'rsvp';

export default ApplicationAdapter.extend(AdaptersUuidMixin, {
  session: service(),

  createRecord(store, type, snapshot) {
    let { email, password, username, timeZone } = get(snapshot, '_attributes');
    return new Promise ((resolve, reject) => {
      return fetch(`${this.get('host')}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name: username, 
          time_zone: timeZone,
          })
      })
      .then(() => {
        return this.get('session').authenticate('authenticator:nanowrimo', email, password)
        .then(() => {
          resolve();
        })
        .catch((json) => {
          reject(get(json, 'error.firstObject'));
        });
      })
      .catch((response) => {
        return response.json()
        .then((json) => {
          reject(json)
        })
        .catch(() => {
          reject();
        });
      });
    });
  }
});
