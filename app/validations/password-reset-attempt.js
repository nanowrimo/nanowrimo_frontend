import {
  validateLength
} from 'ember-changeset-validations/validators';

export default {
  password: [
    validateLength({ min: 8 }),
    validateLength({ max: 128 }) 
  ]
};
