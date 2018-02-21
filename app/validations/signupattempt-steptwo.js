import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  username: [
    validatePresence(true),
  ],
  timeZone: [
    validatePresence(true),
  ]
};
