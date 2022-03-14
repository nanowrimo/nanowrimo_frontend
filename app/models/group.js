import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { filterBy }  from '@ember/object/computed';

const Group = Model.extend({
  name: attr('string'),
  groupId: attr('number'),
  userId: attr('number'),
  approvedById: attr('number'),
  cancelledById: attr('number'),
  startDt: attr('date'),
  endDt: attr('date'),
  groupType: attr('string'),
  slug: attr('string'),
  avatar: attr('string'),
  plate: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),
  timeZone: attr('string'),
  memberCount: attr('number'),
  maxMemberCount: attr('number'),
  joiningRule: attr('number'),
  description: attr('string'),
  url: attr('string'),
  forumLink: attr('string'),
  denormedLastMessage: attr('string'),
  denormedLastMessageAt: attr('string'),
  denormedLastOfficalMessage: attr('string'),
  denormedLastOfficialMessageAt: attr('string'),
  latestMessage: attr('string'),
  latestMessageDt: attr('string'),
  admin_ids: attr('string'),
  
  // Members
  users: hasMany('user'),
  groupUsers: hasMany('group-user'),
  parentGroup: belongsTo('group', { inverse: 'childGroups' }),
  childGroups: hasMany('group', { inverse: 'parentGroup' }),
  
  invitedGroupUsers: filterBy('groupUsers', 'invitationAccepted', '0'),
  activeGroupUsers: filterBy('groupUsers', 'invitationAccepted', '1'),
  
  groupExternalLinks: hasMany('group-external-link'),
  
  locationGroups: hasMany('location-group'),
  locations: hasMany('location'),
  
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
  
  // Returns true if the user can edit the region
  userCanEditGroup(user) {
    if (user.adminLevel) {
      return true;
    } else {
      let uid = user.id;
      let gid = this.id;
      let gus = this.get('store').peekAll('group-user');
      let found = false;
      gus.forEach((gu)=>{
        if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
          found = true;
        }
      });
      return found;
    }
  },
  
  avatarUrl: computed('avatar', function() {
    let avatar = this.get('avatar');
    if (avatar && avatar.includes(':')) {
      return avatar; 
    } else {
      return false;
    }
  }),
  
  _plateUrl: null,
  plateUrl: computed('plate', {
    get() {
      let plate = this.get('plate');
      if (plate && plate.includes(':')) {
        return plate;
      }
      return null;
    }
  }),
    
  // Returns the text for when there's a missing avatar
  avatarText: computed('group', function() {
    let gt = this.get('groupType');
    let name = this.get('name');
    // If this is a region
    if (gt == 'region') {
      let a = name.split(' :: ');
      return a.pop();
    }
    // If this is a writing group
    if (gt == 'writing group') {
      let words = name.split(' ');
      let str = '';
      // Iterate through the words
      words.forEach(function(word) {
        // If the split portion isn't empty, get the initial
        if (word!='') {
          str += word.charAt(0);
        }
      });
      return str;
    }
    // Otherwise, return the name
    return name;
  }),
  
  // Returns the link path for this group
  linkPath: computed('groupType',function() {
    // Get the groupType
    let gt = this.get('groupType');
    // If it's a writing group return true; otherwise return false
    if (gt=='region') {
     return 'authenticated.regions.show';
    }
    if (gt=='writing group') {
     return 'authenticated.writing-groups.show';
    }
    return '';
  }),
  
  // Returns true if the group is a region
  isRegion: computed('groupType',function() {
    let gt = this.get('groupType');
    if (gt == 'region') {
      return true;
    }
    return false;
  }),
  
  // Returns true if the group is a writing group
  isWritingGroup: computed('groupType',function() {
    let gt = this.get('groupType');
    if (gt == 'writing group') {
      return true;
    }
    return false;
  }),
  
  // The string before the last ::
  namePrelim: computed('groupType','name', function() {
    let gt = this.get('groupType');
    let name = this.get('name');
    if (gt == 'region') {
      let a = name.split(' :: ');
      a.pop();
      return a.join(' :: ');
    }
    return '';
  }),
  
  nameFinal: computed('groupType','name', function() {
    let gt = this.get('groupType');
    let n = this.get('name');
    if (gt == 'region') {
      let a = n.split(' :: ');
      return a.pop();
    }
    return n;
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
  adminIds: computed('admin_ids', function(){
    return this.get("admin_ids").split(",");
  }),
  
});

Group.reopenClass({
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */
  optionsForJoiningRule:
  [
    {value:'0', name:'Only group admins may invite people'},
    {value:'1', name:'Any group member may invite people'}
    //{value:'2', name:'Anyone may request to join'},
    //{value:'3', name:'Anyone may automatically join'}
  ],
  
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
