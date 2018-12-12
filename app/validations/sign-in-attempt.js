import {
  validateLength
} from 'ember-changeset-validations/validators';

export default {
  password: [
    validateLength({ min: 6 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ]
};
