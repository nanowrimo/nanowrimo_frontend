import {
  validatePresence
} from 'ember-changeset-validations/validators';
import validateUniqueness from 'nanowrimo/validators/uniqueness';

export default {
    name: [
    validatePresence(true),
    validateUniqueness('name')
  ]
};
