import DS from 'ember-data';
import { computed }  from '@ember/object';
import { next }  from '@ember/runloop';
import { isPresent }  from '@ember/utils';
import Changeset from 'ember-changeset';

const {
  Model,
  attr,
  belongsTo
} = DS;

export default Model.extend({
  title: attr('string'),

  user: belongsTo(),

  _changeset: null,
  changeset: computed({
    get() {
      if (!this.get('_changeset')) {
        this.set('_changeset', new Changeset(this));
      }
      return this.get('_changeset');
    },
    set(key, value) {
      this.set('_changeset', value);
      return value;
    }
  }),

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
