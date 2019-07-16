import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { next }  from '@ember/runloop';
import { isPresent }  from '@ember/utils';
import Changeset from 'ember-changeset';

export default Model.extend({
  title: attr('string'),

  user: belongsTo(),

  changeset: null,
  
  init() {
    this._super(...arguments);
    // if no changeset, make changeset 
    if (!this.get('changeset')) {
      this.set('changeset', new Changeset(this));
    }
  },
  
  persistChanges() {
    if (this.get('isDeleted')) {
      this.save();
    } else if (this.get('changeset.isDirty')) {
      if (isPresent(this.get('changeset.title'))) {
        this.get('changeset').save();
        this.set('_service', null);
      } else {
        this.deleteRecord();
        next(() => {
          this.save();
        });
      }
    }
  },

  rollback() {
    if (this.get('changeset.isDirty')) {
      this.get('changeset').rollback();
    }
    if (this.get('hasDirtyAttributes')) {
      next(() => {
        this.rollbackAttributes();
      });
    }
  }
});
