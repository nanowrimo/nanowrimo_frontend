import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { filterBy }  from '@ember/object/computed';

const User = Model.extend({
  avatar: attr('string'),
  bio: attr('string'),
  createdAt: attr('date'),
  confirmedAt: attr('date'),
  email: attr('string'),
  location: attr('string'),
  name: attr('string'),
  slug: attr('string'),
  timeZone: attr('string'),
  plate: attr('string'),
  postalCode: attr('string'),
  registrationPath: attr('string'),
  currentPassword: attr('string'),
  newPassword: attr('string'),

  statsStreakEnabled: attr('boolean'),
  statsStreak: attr('number'),
  statsProjectsEnabled: attr('boolean'),
  statsProjects: attr('number'),
  statsWordCountEnabled: attr('boolean'),
  statsWordCount: attr('number'),
  statsWritingPaceEnabled: attr('boolean'),
  statsWritingPace: attr('number'),
  statsWordiestEnabled: attr('boolean'),
  statsWordiest: attr('number'),
  statsYearsEnabled: attr('boolean'),
  statsYearsDone: attr('string'),
  statsYearsWon: attr('string'),

  privacyViewBuddies: attr('number'),
  privacyViewProjects: attr('number'),
  privacyViewProfile: attr('number'),
  privacySendNanomessages: attr('number'),
  privacyViewSearch: attr('number'),

  privacyVisibilityRegions: attr('boolean'),
  privacyVisibilityBuddyLists: attr('boolean'),
  privacyVisibilityActivityLogs: attr('boolean'),

  externalLinks: hasMany('externalLink'),
  favoriteAuthors: hasMany('favoriteAuthor'),
  favoriteBooks: hasMany('favoriteBook'),
  projectSessions: hasMany('projectSession'),


  //notification and emails
  notificationBuddyRequests: attr('boolean'),
  notificationNanomessagesMls: attr('boolean'),
  notificationWritingReminders: attr('boolean'),
  notificationBuddyActivities: attr('boolean'),
  notificationNanomessagesHq: attr('boolean'),
  notificationGoalMilestones: attr('boolean'),
  notificationEventsInHomeRegion: attr('boolean'),
  notificationSprintInvitation: attr('boolean'),
  notificationNewBadges: attr('boolean'),
  notificationNanomessagesBuddies: attr('boolean'),
  notificationSprintStart: attr('boolean'),
  emailNewsletter: attr('boolean'),
  emailEventsInHomeRegion: attr('boolean'),
  emailNanomessagesMls: attr('boolean'),
  emailBlogPosts: attr('boolean'),
  emailBuddyRequests: attr('boolean'),
  emailNanomessagesBuddies: attr('boolean'),
  emailNanomessagesHq: attr('boolean'),
  emailWritingReminders: attr('boolean'),

  // Awarded badges
  userBadges: hasMany('user-badge'),
  
  //a user has many timers
  timers: hasMany('timer'),
  //a user has many stopwatches
  stopwatches: hasMany('stopwatch'),

  // Group membership
  groups: hasMany('group'),
  groupUsers: hasMany('group-user'),
  regions: filterBy('groups', 'groupType', 'region'),
  recalculateHome: 0,
  homeRegion: computed('regions.[]','recalculateHome', {
    //homeRegion: computed('regions.[]', 'groupUsers.[]',{
    get() {
      let r = this.get('regions');
      let gu = this.get('groupUsers');
      let maxPrimary = -1;
      let maxRegion = null;
      r.forEach(function(tgroup) {
        gu.forEach(function(tgu) {
          if (tgu.group_id==tgroup.id && tgu.primary>maxPrimary) {
            maxPrimary = tgu.primary;
            maxRegion = tgroup;
          }
        });
      });
      return maxRegion;
    }
  }),

  projects: hasMany('project'),

  //activeGroupUsers: filterBy('groupUsers','exit_at',
  //buddyGroupUsers: filterBy('groupUsers', 'groupType', 'buddies'),
  buddyGroupUsers: computed('groupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    gus.forEach(function(gu) {
      if ((gu.groupType=='buddies')&&(gu.exitAt==null)) {
        bgus.push(gu);
      }
    });
    return bgus;
  }),
  buddyGroupUsersAccepted: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let accepted = [];
    bgus.forEach(function(bgu) {
      if (bgu.invitationAccepted=='1') {
        accepted.push(bgu);
      }
    });
    return accepted;
  }),
  buddyGroupUsersPending: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let pending = [];
    bgus.forEach(function(bgu) {
      if (bgu.invitationAccepted=='0') {
        pending.push(bgu);
      }
    });
    return pending;
  }),
  buddyGroupUsersBlocked: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let blocked = [];
    bgus.forEach(function(bgu) {
      if (bgu.invitationAccepted=='-2') {
        blocked.push(bgu);
      }
    });
    return blocked;
  }),
  buddyGroupsActive: computed('buddyGroupUsersAccepted','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddyGroups = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
              buddyGroups.push(bgu.group);
            }
          }
        });
      });
      return buddyGroups;
    }
  }),
  
  buddiesActive: computed('buddyGroupUsersAccepted','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddies = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
              buddies.push(u);
            }
          }
        });
      });
      return buddies;
    }
  }),
  buddiesInvited: computed('buddyGroupUsersAccepted','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddies = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='0')) {
              buddies.push(u);
            }
          }
        });
      });
      return buddies;
    }
  }),
  buddiesInvitedBy: computed('buddyGroupUsersPending','buddyGroupUsersPending.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersPending');
      let buddies = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
              buddies.push(u);
            }
          }
        });
      });
      return buddies;
    }
  }),

  usersBlocked: computed('buddyGroupUsersBlocked','buddyGroupUsersBlocked.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersBlocked');
      let blocked = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
              blocked.push(u);
            }
          }
        });
      });
      return blocked;
    }
  }),

  _avatarUrl: "/images/users/unknown-avatar.png",
  avatarUrl: computed('avatar', {
    get() {
      let avatar = this.get('avatar');
      if (avatar && avatar.includes(':')) {
        this.set('_avatarUrl', avatar);
      }
      return this.get('_avatarUrl');
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

  isNotConfirmed: computed('confirmedAt', {
    get() {
      return this.get('confirmedAt')==null;
    }
  }),

  rollbackExternalLinks() {
    this.get('externalLinks').forEach(link => {
      if (link) { link.rollback(); }
    });
  },

  rollbackFavorites() {
    this.get('favoriteAuthors').forEach(author => {
      if (author) { author.rollback(); }
    });
    this.get('favoriteBooks').forEach(book => {
      if (book) { book.rollback(); }
    });
  },

  loadGroupUsers(group_types) {
    let u = this;
    this.get('store').query('group-user',
    {
      filter: { user_id: u.id },
      group_types: group_types,
      include: 'user,group'

    });
  },


  primaryProject: computed('projects.@each.primary', function(){
    let ps = this.get('projects');
    let prime = ps.firstObject;

    //loop though the projects
    for(var i = 1; i < ps.length; i++ ) {
      var t_project = ps.objectAt(i);
      if (t_project.primary > prime.primary) {
        prime = t_project;
      }
    }
    return prime;
  }),

  //a user can only hae 1 timer active at a given time
  latestTimer: computed('timers.@each.{duration,start}', function() {
    //sort timers by start desc
    var sorted = this.get('timers').sortBy('start');
    if (sorted.length > 0) {
      let obj = sorted.lastObject;
      return obj;
    } else {
      return null;
    }
  }),

  //a user can only hae 1 stopwatch active at a given time
  latestStopwatch: computed('stopwatches.@each.{start,end}', function() {
    //sort stopwatchs by start desc
    var sorted = this.get('stopwatches').sortBy('start');
    if (sorted.length > 0) {
      let obj = sorted.lastObject;
      return obj;
    } else {
      return null;
    }
  }),

  save() {
    return this._super().then(() => {
      this.get('externalLinks').forEach(link => link.persistChanges());
      this.get('favoriteAuthors').forEach(author => author.persistChanges());
      this.get('favoriteBooks').forEach(book => book.persistChanges());
    });
  },
});

User.reopenClass({
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */

  optionsForPrivacyViewProfile:
  [
    {value:'0', name:'Only I Can See'},
    {value:'1', name:'Only My Buddies And MLs Can See'},
    {value:'2', name:'Only MLs, And Buddies Of My Buddies Can See'},
    {value:'3', name:'Anyone Can See'},

  ],
  optionsForPrivacyViewProjects:
  [
    {value:'0', name:'Only I Can See'},
    {value:'1', name:'Only My Buddies And MLs Can See'},
    {value:'2', name:'Only MLs, And Buddies Of My Buddies Can See'},
    {value:'3', name:'Anyone Can See'},
  ],
  optionsForPrivacyViewBuddies:
  [
    {value:'0', name:'Only I Can See'},
    {value:'1', name:'Only My Buddies And MLs Can See'},
    {value:'2', name:'Only MLs, And Buddies Of My Buddies Can See'},
    {value:'3', name:'Anyone Can See'},
  ],
  optionsForPrivacyViewSearch:
  [
    {value:'0', name:'No One'},
    {value:'1', name:'Only My Buddies And MLs Can See'},
    {value:'2', name:'Only MLs, And Buddies Of My Buddies Can See'},
    {value:'3', name:'Anyone Can See'},
  ],
  optionsForPrivacySendNanomessages:
  [
    {value:'0', name:'No One'},
    {value:'1', name:'Only My Buddies And MLs Can See'},
    {value:'2', name:'Only MLs, And Buddies Of My Buddies Can See'},
    {value:'3', name:'Anyone Can See'},
  ],


});

export default User;
