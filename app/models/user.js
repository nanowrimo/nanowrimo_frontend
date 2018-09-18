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

  externalLinks: hasMany('externalLink'),
  favoriteAuthors: hasMany('favoriteAuthor'),
  favoriteBooks: hasMany('favoriteBook'),
  projectSessions: hasMany('projectSession'),
  
  //privacy
  privacyViewProfile: attr('string'),
  privacyViewProjects: attr('string'),
  privacyViewBuddies: attr('string'),
  privacyViewSearch: attr('string'),
  privacySendNanomessages: attr('string'),
  

  privacyVisibilityRegions: attr('boolean'),
  privacyVisibilityBuddyLists: attr('boolean'), 
  privacyVisibilityActivityLogs: attr('boolean'),
  
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
  
  // Group membership
  groups: hasMany('group'),
  groupUsers: hasMany('groupUser'),
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
