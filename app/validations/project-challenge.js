import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  goal: validatePresence(true),
  startsAt: validatePresence(true),
  endsAt: validatePresence(true)
};
