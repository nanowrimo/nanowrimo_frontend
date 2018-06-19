import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  defaultGoal: validatePresence(true)
};
