import {
  validatePresence
} from 'ember-changeset-validations/validators';
import and from 'ember-changeset-hofs/utils/and'
import validateUniqueness from 'nanowrimo/validators/uniqueness';

export default {
  name: and(
    validatePresence(true),
    validateUniqueness('name')
  )
};
