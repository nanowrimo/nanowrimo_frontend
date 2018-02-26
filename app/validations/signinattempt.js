import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';

export default {
  email: validateFormat({ type: 'email' }),
  password: [
    validateLength({ min: 6 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ]
};
