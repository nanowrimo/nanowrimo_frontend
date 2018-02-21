import { Promise } from 'rsvp';
import { capitalize } from '@ember/string';
import handleMultipleValidations from 'ember-changeset-validations/utils/handle-multiple-validations';
import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';

export default function validateUniqueness(remoteKey, validators) {
  return (key, newValue, oldValue, changes, content) => { // eslint-disable-line no-unused-vars

    let preValid = handleMultipleValidations(validators, { key, newValue, oldValue, changes, content });
    if (preValid !== true) {
      return preValid;
    }

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
