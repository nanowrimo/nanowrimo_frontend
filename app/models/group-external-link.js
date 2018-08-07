import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { next }  from '@ember/runloop';
import { isPresent }  from '@ember/utils';
import Changeset from 'ember-changeset';
import ENV from 'nanowrimo/config/environment';

export default Model.extend({
  url: attr('string'),

  group: belongsTo(),

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

  _service: null,
  service: computed('url', {
    get() {
      let url = this.get('url');
      if (!url) { return this.get('_service'); }

      let service = ENV.APP.SOCIAL_SERVICES.find(service => {
        return this.get('url').includes(`${service}.com`);
      });
      if (service) {
        this.set('_service', service);
      }

      return service || this.get('_service');
    },
    set(key, value) {
      this.set('_service', value);
      return value;
    }
  }),

  persistChanges() {
    if (this.get('isDeleted')) {
      this.save();
    } else if (this.get('changeset.isDirty')) {
      if (isPresent(this.get('changeset.url'))) {
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
