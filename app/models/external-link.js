import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed, observer }  from '@ember/object';
import { next }  from '@ember/runloop';
import { isPresent }  from '@ember/utils';
import Changeset from 'ember-changeset';
import ENV from 'nanowrimo/config/environment';

export default Model.extend({
  url: attr('string'),

  user: belongsTo(),

  changeset: null,
  service: null,
  
  init() {
    this._super(...arguments);
    // if no changeset, make changeset 
    if (!this.get('changeset')) {
      this.set('changeset', new Changeset(this));
    }
    this.determineService();
  },
  
  urlChanged: observer('url', function(){
    this.determineService();
  }),

  link: computed('url', function(){
    //get the url
    let link = this.get('url');
    if (link) {
      let ll = link.toLowerCase();
      //does the url start with http:// or https://?
      if ( !ll.startsWith('https://') && !ll.startsWith('http://') ) {
        link = `https://${link}`;
      } 
      return link;
    }
  }),
  
  determineService() {
    let url = this.get('url');
    if (url) { 
      for (var i =0; i < ENV.APP.SOCIAL_SERVICES.length; i++) {
        let service = ENV.APP.SOCIAL_SERVICES[i];
        // is service  in the url?
        if (url.includes(`${service}.com`)) {
          this.set('service', service);
          break;
        }
      }
    }
  },
  
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
