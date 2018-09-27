import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { filterBy }  from '@ember/object/computed';

export default Model.extend({
  name: attr('string'),
  userId: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  groupType: attr('string'),
  slug: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),
  timeZone: attr('string'),
  numberOfUsers: attr('number'),
  description: attr('string'),
  plate: attr('string'),
  
  
  // Members
  users: hasMany('user'),
  groupUsers: hasMany('group-user'),
  invitedGroupUsers: filterBy('groupUsers', 'invitationAccepted', '0'),
  activeGroupUsers: filterBy('groupUsers', 'invitationAccepted', '1'),
  
  groupExternalLinks: hasMany('group-external-link'),
  
  membersActive: computed('groupUsers', {
    get() {
      let store = this.get('store');
      
    }
  }),
  _plateUrl: null,
  plateUrl: computed('plate', {
    get() {
      let plate = this.get('plate');
      if (plate && plate.includes(':')) {
        this.set('_plateUrl', plate);
      }
      return this.get('_plateUrl');
    }
  }),

  rollbackGroupExternalLinks() {
    this.get('groupExternalLinks').forEach(link => {
      if (link) { link.rollback(); }
    });
  },

  save() {
    return this._super().then(() => {
      this.get('groupExternalLinks').forEach(link => link.persistChanges());
    });
  },
  
});
