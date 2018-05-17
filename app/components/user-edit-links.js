import Component from '@ember/component';
import { computed }  from '@ember/object';
import { union }  from '@ember/object/computed';
import { next }  from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  store: service(),

  tagName: '',

  newLinks: null,
  user: null,

  inputLinks: union('editLinks', 'newLinks'),

  editLinks: computed('user.externalLinks.@each.isDeleted', function() {
    let links = this.get('user.externalLinks').filterBy('isDeleted', false);
    let editLinks = [];

    // Show an input for each Social Service first
    ENV.APP.SOCIAL_SERVICES.forEach((service) => {
      let matchingLink = links.findBy('service', service);
      editLinks.pushObject(matchingLink || this._newExternalLink({ service }));
    });

    // Show an input for other existing links next
    let otherLinks = links.reject(link => {
      return editLinks.includes(link);
    });
    editLinks.pushObjects(otherLinks);

    return editLinks;
  }),

  _newExternalLink(attrs) {
    let link = this.get('store').createRecord('external-link', attrs);
    next(() => {
      link.set('user', this.get('user'));
    })
    return link;
  },

  init() {
    this._super(...arguments);
    this.set('newLinks', [ this._newExternalLink() ]);
  },

  actions: {
    addLink() {
      this.get('newLinks').pushObject(this._newExternalLink());
    },

    clearLink(link) {
      if (link.get('service')) {
        link.set('changeset.url', null);
      } else {
        this.get('newLinks').removeObject(link);
        link.deleteRecord();
      }
    }
  }
});
