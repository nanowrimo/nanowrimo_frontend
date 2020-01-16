import Component from '@ember/component';
import { computed }  from '@ember/object';
import { filterBy, setDiff, union }  from '@ember/object/computed';
import { next }  from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  store: service(),

  tagName: '',

  _newLinks: null,
  group: null,

  _existingLinks: filterBy('group.groupExternalLinks', 'isDeleted', false),
  _otherLinks: setDiff('_existingLinks', '_socialLinks'),
  _otherSavedLinks: filterBy('_otherLinks', 'isNew', false),
  inputLinks: union('_socialLinks', '_otherSavedLinks', '_newLinks'),

  _socialLinks: computed('_existingLinks.@each.service', function() {
    let links = this.get('_existingLinks');

    let socialLinks = ENV.APP.SOCIAL_SERVICES.reduce((acc, service) => {
      let link = links.findBy('service', service);
      if (!link || link.url == null) { 
        //link = this._newExternalLink({ service }); 
      } else {
        if (acc) {
          return acc.concat(link);
        }
      }
    }, []);
    return socialLinks;
  }),
  
  canAddAnotherLink: computed('_otherSavedLinks.[]', '_newLinks.[]', function() {
    return this.get('_otherSavedLinks').length + this.get('_newLinks').length < 5;
  }),

  _newGroupExternalLink(attrs) {
    let link = this.get('store').createRecord('group-external-link', attrs);
    next(() => {
      link.set('group', this.get('group'));
    })
    return link;
  },

  init() {
    this._super(...arguments);
    let newLinks = [];
    if (this.get('_otherSavedLinks').length < 5) {
      newLinks.pushObject(this._newGroupExternalLink());
    }
    this.set('_newLinks', newLinks);
  },

  actions: {
    addLink() {
      if (this.get('canAddAnotherLink')) {
        this.get('_newLinks').pushObject(this._newGroupExternalLink());
      }
    },

    clearLink(link) {
      if (link.get('service')) {
        link.set('changeset.url', null);
      } else {
        this.get('_newLinks').removeObject(link);
        link.deleteRecord();
      }
    }
  }
});
