import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  goal: validateNumber({ gt: 0 }),
  startsAt: validatePresence(true),
  endsAt: validatePresence(true)
};
