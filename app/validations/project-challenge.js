import {
  validatePresence
} from 'ember-changeset-validations/validators';
import validateBeforeDate from 'nanowrimo/validators/before-date';

export default {
  goal: validatePresence(true),
  startsAt: validateBeforeDate({date: "endsAt"})
};
