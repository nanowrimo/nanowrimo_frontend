import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isEmpty, isNone } from '@ember/utils';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  checkRelationships: null, //an array of relationships that may need saving 
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

  _callAction(action, args) {
    let callback = this.get(action);
    if (callback) { callback(args); }
  },

  _checkRelationships() {
    let relationships = this.get('checkRelationships');
    let rel_array = [];
    if (relationships) {
      relationships.forEach((r) => {
        //get the model's relationship models
        let models = this.get(`model.${r}`);
        //let models = this.get('model').get(r);
        //loop through the models
        models.forEach((m)=>{
          // does the model have an id? 
          if(!m.id) {
            // no id, the item needs to be saved
            //save the model and push onto the relationship array
           rel_array.push( m.save() );
          }
        });
      });
    }
    return rel_array;
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
      alert('yse');
    },
    
    submitForm() {
      if (this.get('isLastStep')) {
        let changeset = this.get('changeset');
        if (isNone(this.get('model.relationshipErrors')) && changeset.get('isValid')) {
          let modelIsNew = this.get('model.isNew');
          Promise.all(this._checkRelationships())
          .then(()=>{          
            return changeset.save()
            .then(() => {
              this._saveAfterSave();
              this._callAction('afterSubmit', modelIsNew);
            })
            .catch((error) => {
              this._callAction('afterError', error);
            });
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
