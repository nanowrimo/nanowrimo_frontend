import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  content: validatePresence(true)
};
