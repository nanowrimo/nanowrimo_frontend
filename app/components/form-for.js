import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  currentStepIndex: 0,
  hasAttemptedSubmit: false,
  model: null,
  steps: null, // {(property<string>[])[]}

  isLastStep: computed('currentStepIndex', 'steps.[]', function() {
    let steps = this.get('steps');
    if (isEmpty(steps)) { return true; }
    return this.get('currentStepIndex') === (steps.length - 1)
  }),

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

  _callAfterSubmit(modelWasNew) {
    let callback = this.get('afterSubmit');
    if (callback) { callback(modelWasNew); }
  },

  _currentStepIsValid: computed('changeset.error', 'currentStepIndex', 'steps.[]', function() {
    let propertiesForStep = this.get('steps').objectAt(this.get('currentStepIndex'));
    if (propertiesForStep) {
      return propertiesForStep.every((property) => {
        return this.get(`changeset.error.${property}`) === undefined;
      });
    }
    return true;
  }),

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
    submitForm() {
      if (this.get('isLastStep')) {
        let changeset = this.get('changeset');
        if (changeset.get('isValid')) {
          let modelIsNew = this.get('model.isNew');
          return changeset.save()
          .then(() => {
            this._callAfterSubmit(modelIsNew);
          })
          .catch((error) => {
            this._callAfterError(error);
          });
        } else {
          this.set('hasAttemptedSubmit', true);
        }
      } else {
        if (this.get('_currentStepIsValid')) {
          this.set('hasAttemptedSubmit', false);
          this.incrementProperty('currentStepIndex');
        } else {
          this.set('hasAttemptedSubmit', true);
        }
      }
    }
  }
});
