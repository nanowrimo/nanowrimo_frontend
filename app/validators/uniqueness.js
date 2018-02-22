import { Promise } from 'rsvp';
import { capitalize } from '@ember/string';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';

const DEBOUNCE_MS = ENV.APP.DEBOUNCE_MS;
let db_timeout;

export default function validateUniqueness(remoteKey) {
  return (key, newValue, oldValue, changes, content) => { // eslint-disable-line no-unused-vars
    return new Promise((resolve) => {
      clearTimeout(db_timeout);
      db_timeout = setTimeout(() => {
        let url = `${ENV.APP.API_HOST}/uniqueness?${remoteKey}=${newValue}`;

        return fetch(url).then((response) => {
          if (response.status === 404) {
            resolve(true);
          } else if (response.status === 200) {
            resolve(`${capitalize(remoteKey)} is already taken`);
          } else {
            resolve(`Cannot validate uniqueness of ${capitalize(remoteKey)}`);
          }
        });
      }, DEBOUNCE_MS);
    });
  };
}
