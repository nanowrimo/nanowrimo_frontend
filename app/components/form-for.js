import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isEmpty, isNone } from '@ember/utils';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  currentStepIndex: 0,
  hasAttemptedSubmit: false,
  model: null,
  steps: null, // {(property<string>[])[]}
  saveAfterSave: null,
  
  _currentStepIsValid: computed('changeset.error', 'currentStepIndex', 'steps.[]', function() {
    let propertiesForStep = this.get('steps').objectAt(this.get('currentStepIndex'));
    if (propertiesForStep) {
      return propertiesForStep.every((property) => {
        return this.get(`changeset.error.${property}`) === undefined;
      });
    }
    return true;
  }),

  isLastStep: computed('currentStepIndex', 'steps.[]', function() {
    let steps = this.get('steps');
    if (isEmpty(steps)) { return true; }
    return this.get('currentStepIndex') === (steps.length - 1)
  }),

  init() {
    this._super(...arguments);
    let model = this.get('model');
    assert('Must pass a model into {{form-for}}', this.get('model'));

    // if there was not a supplied changeset 
    if (!this.get('changeset')) {
      let validator = this._factoryForValidator(model);
      let changeset;
      if (validator) {
        changeset = new Changeset(model, lookupValidator(validator), validator);
        changeset.validate();
      } else {
        changeset = new Changeset(model);
      }
      this.set('changeset', changeset);
    }
  },

  _callAction(action, args) {
    let callback = this.get(action);
    if (callback) { callback(args); }
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
  
  _saveAfterSave() {
    let sas = this.get('saveAfterSave');
    if (sas) {
      sas.save();
    }
  },

  actions: {
    goToStep() {
    },
    
    submitForm() {
      if (this.get('isLastStep')) {
        let changeset = this.get('changeset');
        // call the onSubmit action, if there is one
        this._callAction('onSubmit');
        if (isNone(this.get('model.relationshipErrors')) && changeset.get('isValid')) {
          let modelIsNew = this.get('model.isNew');
          return changeset.save()
          .then(() => {
            this._saveAfterSave();
            this._callAction('afterSubmit', modelIsNew);
          })
          .catch((error) => {
            this._callAction('afterError', error);
          });
         
          
        } else {
          this._callAction('submitValidationError');
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
