import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed, observer }  from '@ember/object';
import { filterBy }  from '@ember/object/computed';

const Group = Model.extend({
  name: attr('string'),
  groupId: attr('number'),
  userId: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  startDt: attr('date'),
  endDt: attr('date'),
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
  parentGroup: belongsTo('group', { inverse: 'childGroups' }),
  childGroups: hasMany('group', { inverse: 'parentGroup' }),
  
  invitedGroupUsers: filterBy('groupUsers', 'invitationAccepted', '0'),
  activeGroupUsers: filterBy('groupUsers', 'invitationAccepted', '1'),
  
  groupExternalLinks: hasMany('group-external-link'),
  
  locationGroups: hasMany('location-group'),
  
  groupsLoaded: false,
  loadGroups(group_types) {
    let g = this;
    this.get('store').query('group',
    {
      filter: { groupId: g.id },
      group_types: group_types,
    }).then(()=>{
      this.set('groupsLoaded', true);
    });
  },
  /*events: filter('projects.@each.id', function(project) {
    return project.id > 0;
  }),*/
  /*eventsActive: observer('locationGroups', {
    get() {
      let lgs = this.get('locationGroups');
      let store = this.get('store');
      lgs.forEach(function(bgu) {
        console.log(lg.id);
      });
      return lgs;
    }
  }),*/
  
  /*loadLocationGroups() {
    let g = this;
    this.get('store').query('location-group',
    {
      filter: { group_id: g.id },
      include: 'location'
    });
  },*/
  
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

Group.reopenClass({
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */
  optionsForHours:
  [
    {value:'0', name:'0 hours'},
    {value:'1', name:'1 hour'},
    {value:'2', name:'2 hours'},
    {value:'3', name:'3 hours'},
    {value:'4', name:'4 hours'},
    {value:'5', name:'5 hours'},
    {value:'6', name:'6 hours'},
    {value:'7', name:'7 hours'},
    {value:'8', name:'8 hours'},
    {value:'9', name:'9 hours'},
    {value:'10', name:'10 hours'},
    {value:'11', name:'11 hours'},
    {value:'12', name:'12 hours'}
  ],
  
  optionsForMinutes:
  [
    {value:'0', name:'0 minutes'},
    {value:'5', name:'5 minutes'},
    {value:'10', name:'10 minutes'},
    {value:'15', name:'15 minutes'},
    {value:'20', name:'20 minutes'},
    {value:'25', name:'25 minutes'},
    {value:'30', name:'30 minutes'},
    {value:'35', name:'35 minutes'},
    {value:'40', name:'40 minutes'},
    {value:'45', name:'45 minutes'},
    {value:'50', name:'50 minutes'},
    {value:'55', name:'55 minutes'}
  ]
  
  
});


export default Group;
