import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  hasAttemptedSubmit: false,
  model: null,

  didReceiveAttrs() {
    this._super(...arguments);
    let model = this.get('model');
    assert('Must pass a model into {{form-for}}', this.get('model'));

    let validator = this._factoryForValidator(model);
    let changeset;
    if (validator) {
      changeset = new Changeset(model, lookupValidator(validator), validator);
      changeset.validate();
    } else {
      changeset = new Changeset(model);
    }
    this.set('changeset', changeset);
  },

  _callAfterError(error) {
    let callback = this.get('afterError');
    if (callback) { callback(error); }
  },

  _factoryForValidator(model) {
    let { modelName } = model.constructor;

    if (modelName) {
      let owner = getOwner(this);
      let validator = owner.factoryFor(`validation:${modelName}`);
      if (validator) {
        return validator.class;
      }
    }

    return null;
  },

  actions: {
    validateAndSubmit() {
      let changeset = this.get('changeset');
      if (changeset.get('isValid')) {
        return changeset.save()
        .catch((error) => {
          this._callAfterError(error);
        });
      } else {
        return this.set('hasAttemptedSubmit', true);
      }
    }
  }
});
