import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { observer }  from '@ember/object';
import { next }  from '@ember/runloop';
import { isPresent }  from '@ember/utils';
import Changeset from 'ember-changeset';
import ENV from 'nanowrimo/config/environment';

export default Model.extend({
  url: attr('string'),

  group: belongsTo(),

  changeset: null,
  service: null,
  
  init() {
    this._super(...arguments);
    // if no changeset, make changeset 
    if (!this.get('changeset')) {
      this.set('changeset', new Changeset(this));
    }
  },

  urlChanged: observer('url', function(){
    let service = ENV.APP.SOCIAL_SERVICES.find(service => {
      return this.get('url').includes(`${service}.com`);
    });
    if (service) {
      this.set('service', service);
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
