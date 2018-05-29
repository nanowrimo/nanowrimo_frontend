import { Promise } from 'rsvp';
import { get } from '@ember/object';
import { capitalize } from '@ember/string';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';

const DEBOUNCE_MS = ENV.APP.DEBOUNCE_MS;
let db_timeout = {}; // Store timeouts on per-key basis so different keys don't cancel each other

export default function validateUniqueness(remoteKey) {
  return (key, newValue, oldValue, changes, content) => { // eslint-disable-line no-unused-vars
    if (newValue === oldValue) { return true; }
    return new Promise((resolve) => {
      clearTimeout(db_timeout[remoteKey]);
      db_timeout[remoteKey] = setTimeout(() => {
        let url = `${ENV.APP.API_HOST}/users/uniqueness?${remoteKey}=${newValue}`;

        return fetch(url).then((response) => {
          if (response.status !== 200) {
            resolve(`Cannot validate uniqueness of ${capitalize(remoteKey)}`);
          }

          return response.json().then((json) => {
            if (get(json, 'available')) {
              resolve(true);
            } else {
              resolve(`${capitalize(remoteKey)} is already taken`);
            }
          });
        });
      }, DEBOUNCE_MS);
    });
  };
}
