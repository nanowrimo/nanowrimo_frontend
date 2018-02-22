import { Promise } from 'rsvp';
import { capitalize } from '@ember/string';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';

export default function validateUniqueness(remoteKey) {
  return (key, newValue, oldValue, changes, content) => { // eslint-disable-line no-unused-vars
    return new Promise((resolve) => {
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
    });
  };
}
