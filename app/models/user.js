import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { sort, filter, filterBy }  from '@ember/object/computed';
import moment from 'moment';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

const User = Model.extend({
  store: service(),
  session: service(),

  avatar: attr('string'),
  adminLevel: attr('number'),
  bio: attr('string'),
  createdAt: attr('date'),
  confirmedAt: attr('date'),
  notificationsViewedAt: attr('date'),
  email: attr('string'),
  location: attr('string'),
  name: attr('string'),
  discourseUsername: attr('string'),
  slug: attr('string'),
  timeZone: attr('string'),
  plate: attr('string'),
  postalCode: attr('string'),
  registrationPath: attr('string'),
  currentPassword: attr('string'),
  newPassword: attr('string'),
  halo: attr('boolean'),
  laurels: attr('number'),
  
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
  emailNanowrimoUpdates: attr('boolean'),
  emailNewsletter: attr('boolean'),
  emailEventsInHomeRegion: attr('boolean'),
  emailNanomessagesMls: attr('boolean'),
  emailBlogPosts: attr('boolean'),
  emailBuddyRequests: attr('boolean'),
  emailNanomessagesBuddies: attr('boolean'),
  emailNanomessagesHq: attr('boolean'),
  emailWritingReminders: attr('boolean'),
  
  settingSessionMoreInfo: attr('boolean'),
  notifications: hasMany('notification'),
  settingSessionCountBySession: attr('number'),
  projects: hasMany('project'),
  projectChallenges: hasMany('projectChallenge'),
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
  
  stats: null,
  annualStats: null,
  homeRegion: null,
  buddiesLoaded: false,
  
  // Returns true if the user is an admin
  isAdmin: computed('adminLevel', function() {
    return (this.get('adminLevel')>0);
  }),
  
  // ---------------------------
  // BEGINNING OF DATETIME FUNCTIONS
  // ---------------------------
  
  // Returns the provided datetime d in the user's time zone
  dateTimeInTimeZone(d) {
    // First get the current time from the user's device
    let utcTime = moment(d);
    // Return the time to the user's time zone
    return utcTime.tz(this.get('timeZone'));
  },
  
  // Returns a date string of the current time in the user's time zone
  currentDateStringInTimeZone: computed('timeZone',function() {
    // First get the current time from the user's device
    let utcTime = moment();
    // Return date string in user's time zone
    return this.dateStringInTimeZone(utcTime);
  }),
  
  // Returns a date string of the provided time in the user's time zone
  dateStringInTimeZone (d) {
    // Get datetime in user's time zone
    let dt = this.dateTimeInTimeZone(d);
    // Return date string from it
    return dt.format('YYYY-MM-DD');
  },
  
  // Returns a date string of the provided time in the user's time zone
  shortDateStringInTimeZone (d) {
    // Get datetime in user's time zone
    let dt = this.dateTimeInTimeZone(d);
    // Return date string from it
    return dt.format('MMM D, YYYY');
  },
  
  // Takes start and end dates as formatted strings. Returns true if date is in range, otherwise false
  currentDateInDateRange(start,end) {
    let c = this.get('currentDateStringInTimeZone');
    if ((c>=start)&&(c<=end)) {
      return true;
    } else {
      return false;
    }
  },
  
  // ---------------------------
  // END OF DATETIME FUNCTIONS
  // ---------------------------
  
  
  // ---------------------------
  // BEGINNING OF PROJECT FUNCTIONS
  // ---------------------------
  
  storeProjects: computed('projects.@each.createdAt',function() {
    let store = this.get('store');
    return store.peekAll('project');
  }),
  
  computedProjects: computed('storeProjects.@each.activeProjectChallenge',function() {
    //let store = this.get('store');
    let allProjects = this.get('storeProjects');
    let id = this.get('id');
    let ps = [];
    allProjects.forEach(function(p) {
      if (p.user_id==id) {
        ps.push(p);
      }
    });
    return ps;
  }),
  
  activeProjects: computed('computedProjects.[]',function() {
    let allProjects = this.get('computedProjects');
    let aps = [];
    allProjects.forEach(function(p) {
      if (p.activeProjectChallenge) {
        aps.push(p);
      }
    });
    return aps;
  }),
  
  persistedProjects: filter('computedProjects', function(project) {
    return project.id > 0;
  }),
  
  persistedProjectsWithGoals: computed('persistedProjects.[]', function() {
    let pps = this.get('persistedProjects');
    let aps = [];
    pps.forEach(function(p) {
      if (p.hasProjectChallenges) {
        aps.push(p);
      }
    });
    return aps;
  }),
  
  // ---------------------------
  // END OF PROJECT FUNCTIONS
  // ---------------------------
  
  // Returns true if user has won latest event, false if not
  currentEventWon: computed('projectChallenges.@each.currentCount',function() {
    //let pcs = this.get('projectChallenges');
    // Set a variable to return
    let winner = false;
    // Set a local variable for the store
    let store = this.get('store');
    // Set a local variable for all challenges in the store
    let cs = store.peekAll('challenge');
    // Set a local variable for the correct challenge
    let newc = null;
    // Loop through the challenges to find the latest event
    cs.forEach(function(c) {
      // If this is a November event
      if (c.eventType==0) {
        // If the challenge is newer than ones already found
        if ((newc===null)||(newc.endsAt<c.endsAt)) {
          // Set the challenge variable to this challenge
          newc = c;
        }
      }
    });
    // If the challenge has been found...
    if (newc) {
      // Get the current user id
      let cuid = this.get('id');
      // If the current user id exists...
      if (cuid) {
        // Get all project_challenges
        let pcs = store.peekAll('project-challenge');
        // Loop through them
        pcs.forEach(function(pc) {
          // If this project challenge is for the latest event...
          if (newc.id==pc.challenge_id) {
            // Find the associated project
            let p = store.peekRecord('project',pc.project_id);
            // If the project is found
            if (p) {
              // If the current user is the author
              if (p.user_id==cuid) {
                // if the goal has been met
                if (pc.currentCount>=pc.goal) {
                  // The user won
                  winner = true;
                }
              }
            }
          }
        });
      }
    }
    // Return if they won or not
    return winner;
  }),
  
  //groupUsersLoaded is false by default, is updated when groupUsers are loaded 
  groupUsersLoaded: false,
  
  avatarUnknownUrl: "/images/users/unknown-avatar.png",
  plateUnknownUrl: null,
  
  recalculateHome: 0,
  
  myInvitations: computed('groupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    //are there group users?
    if (gus) {
      gus.forEach(function(gu) {
        if (((gu.groupType=='region')||(gu.groupType=='writing group'))&&(gu.exitAt==null)&&(gu.invitationAccepted==0)) {
          bgus.push(gu.group);
        }
      });
    }
    return bgus;
  }),
  
  groupUsersSortingDesc: Object.freeze(['entryAt:desc']),
  sortedGroupUsers: sort('groupUsers','groupUsersSortingDesc'),
  
  myGroups: computed('sortedGroupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('sortedGroupUsers');
    let bgus = [];
    //are there group users?
    if (gus) {
      gus.forEach(function(gu) {
        if (((gu.groupType=='region')||(gu.groupType=='writing group'))&&(gu.exitAt==null)&&(gu.invitationAccepted==1)) {
          bgus.push(gu.group);
        }
      });
    }
    return bgus;
  }),
  
  myWritingGroups: computed('groupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    //are there group users?
    if (gus) {
      gus.forEach(function(gu) {
        if ((gu.groupType=='writing group')&&(gu.exitAt==null)&&(gu.invitationAccepted==1)) {
          bgus.push(gu.group);
        }
      });
    }
    return bgus;
  }),
  
  myWritingGroupUsers: computed('groupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    //are there group users?
    if (gus) {
      gus.forEach(function(gu) {
        if ((gu.groupType=='writing group')&&(gu.exitAt==null)) {
          bgus.push(gu.group);
        }
      });
    }
    return bgus;
  }),

  //buddyGroupUsers: filterBy('groupUsers', 'groupType', 'buddies'),
  convoGroups: computed('groupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    //are there group users?
    if (gus) {
      gus.forEach(function(gu) {
        if ((gu.groupType=='buddies')&&(gu.exitAt==null)) {
          bgus.push(gu.group);
        }
      });
    }
    return bgus;
  }),
  
  
  // ---------------------------
  // BEGINNING OF BUDDY FUNCTIONS
  // ---------------------------


  buddyGroupUsers: computed('groupUsers.[]','groupUsers.@each.{invitationAccepted,exitAt}', function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    //are there group users?
    if (gus) {
      gus.forEach(function(gu) {
        if ((gu.groupType=='buddies')&&(gu.exitAt==null)) {
          bgus.push(gu);
        }
      });
    }
    return bgus;
  }),
  buddyGroupUsersAccepted: computed('buddyGroupUsers.[]','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let accepted = [];
    //are there buddy group users?
    if (bgus) {
      bgus.forEach(function(bgu) {
        if (bgu.invitationAccepted=='1') {
          accepted.push(bgu);
        }
      });
    }
    return accepted;
  }),
  buddyGroupUsersPending: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let pending = [];
    //are there buddy group users?
    if (bgus) {
      bgus.forEach(function(bgu) {
        if (bgu.invitationAccepted=='0') {
          pending.push(bgu);
        }
      });
    }
    return pending;
  }),
  buddyGroupUsersInvited: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    const store = this.get('store');
    let pending = [];
    let id = this.get('id');
    
    //are there buddy group users?
    if (bgus) {
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.id!=id) && (gu.invitationAccepted=='0')) {
              pending.push(gu);
            }
          }
        });
      });
    }
    return pending;
  }),
  buddyGroupUsersBlocked: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let blocked = [];
    //are there buddy group users?
    if (bgus) {
      bgus.forEach(function(bgu) {
        if (bgu.invitationAccepted=='-2') {
          blocked.push(bgu);
        }
      });
    }
    return blocked;
  }),
  
  buddyGroupsActive: computed('buddiesLoaded','buddyGroupUsersAccepted.[]','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', function(){
    let buddyGroups = [];
    if (this.get('buddiesLoaded')) {
      let bgus = this.get('buddyGroupUsersAccepted');
      let store = this.get('store');
      let id = this.get('id');
      // are there any acceptd buddy group users?
      if (bgus) {
        bgus.forEach(function(bgu) {
          //get the groupusers for the buddy group
          let gus = bgu.group.get('groupUsers');
          gus.forEach(function(gu) {
            if (gu.user_id) {
              let u = store.peekRecord('user', gu.user_id);
              if ((u) && (u.id!=id) && (gu.invitationAccepted=='1') && (gu.exitAt==null)) {
                buddyGroups.push(bgu.group);
              }
            }
          });
        });
      }
    }
    return buddyGroups;
  }),
  
  buddiesActive: computed('buddiesLoaded','buddyGroupUsersAccepted.[]','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}',function(){
    let bgus = this.get('buddyGroupUsersAccepted');
    let buddies = [];
    let store = this.get('store');
    let id = this.get('id');
    // are there buddyGroupUsersAccepted?
    if (bgus && this.get('buddiesLoaded')) {
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.id!=id) && (gu.invitationAccepted=='1') && (gu.exitAt==null)) {
              buddies.push(u);
            }
          }
        });
      });
    }
    return buddies;

  }),
  buddiesInvited: computed('buddyGroupUsersAccepted.[]','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddies = [];
      let store = this.get('store');
      let id = this.get('id');
      // is the bgus null?
      if (bgus) {
        bgus.forEach(function(bgu) {
          let gus = bgu.group.get('groupUsers');
          gus.forEach(function(gu) {
            if (gu.user_id) {
              let u = store.peekRecord('user', gu.user_id);
              if ((u) && (u.id!=id) && (gu.invitationAccepted=='0')) {
                buddies.push(u);
              }
            }
          });
        });
      }
      return buddies;
    }
  }),
  buddiesInvitedBy: computed('buddyGroupUsersPending','buddyGroupUsersPending.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersPending');
      let buddies = [];
      let store = this.get('store');
      let id = this.get('id');
      // does the bgus have value?
      if (bgus) {
        bgus.forEach(function(bgu) {
          let gus = bgu.group.get('groupUsers');
          gus.forEach(function(gu) {
            if (gu.user_id) {
              let u = store.peekRecord('user', gu.user_id);
              if ((u) && (u.id!=id) && (gu.invitationAccepted=='1')) {
                buddies.push(u);
              }
            }
          });
        });
      }
      return buddies;
    }
  }),

  // load the user's buddies, removing 
  loadBuddies() {
    // reload the user's buddies
    //return this.get('user').hasMany('groups').reload();
    this.get('store').query('group-user',
    {
      filter: { user_id: this.get('id') },
      group_types: 'buddies',
      include: 'user,group'
    }).then(data=>{
      // buddes have been loaded
      this.set('buddiesLoaded', true);
      // keep track of the ids for returned content
      let newIds = [];
      data.content.forEach((gu)=>{
        newIds.push(gu.id);
      });
      // unload any of this users buddy group_users that have an id not in the newIds
      this.get('buddyGroupUsers').forEach(bgu=>{
        if (newIds.indexOf(bgu.id)==-1) {
          // no longer a buddy
          bgu.unloadRecord();
        }
      });
    });
  },

  // ---------------------------
  // END OF BUDDY FUNCTIONS
  // ---------------------------
  
  nanomessagesGroups: computed('groupUsersLoaded','groupUsers.[]', function(){
    let eGroups = [];
    if (this.get('groupUsersLoaded')) {
      let gus = this.get('groupUsers');
      let store = this.get('store');
      gus.forEach(function(gu) {
        let g = store.peekRecord('group', gu.group_id);
        if ((g.groupType=='everyone')||(g.groupType=='region')||(g.groupType=='buddies')) {
          eGroups.push(g);
        }
      });
    }
    return eGroups;
  }),
  
  usersBlocked: computed('buddyGroupUsersBlocked','buddyGroupUsersBlocked.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersBlocked');
      let blocked = [];
      let store = this.get('store');
      let email = this.get('email');
      // does bgus contain data?
      if (bgus) {
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
      }
      return blocked;
    }
  }),

  avatarUrl: computed('avatar', function() {
    let avatar = this.get('avatar');
    if (avatar && avatar.includes(':')) {
      return avatar; 
    } else {
      return this.get('avatarUnknownUrl');
    }
  }),

  plateUrl: computed('plate', function() {
    let plate = this.get('plate');
    if (plate && plate.includes(':')) {
      return plate; 
    } else {
      return this.get('plateUnknownUrl');
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
    let store = this.get('store');
    store.query('group-user',
    {
      filter: { user_id: u.id },
      group_types: group_types,
      include: 'user,group'
    }).then(function() {
      debounce(u, u.connectGroupUsers, 1000, false);
    });
  },
  
  loadHomeRegion(){ 
    let store = this.get('store');
    store.queryRecord("group", { homeRegion: true}).then(response=>{
      this.set('homeRegion', response);
    });
  },
  
  connectGroupUsers() {
    //let store = this.get('store');
    //let gus = store.peekAll('group-user');
    //gus.forEach((gu)=>{
      //gu.normalize();
    //});
    debounce(this, this.setGroupUsersLoaded, 1000, false);
  },
  
  setGroupUsersLoaded() {
    this.set('groupUsersLoaded', true);
    //alert(this.get('groupUsersLoaded'));
  },

  projectsSortingCreatedDesc: Object.freeze(['createdAt:desc']),
  projectsSortedCreatedDesc: sort('projects','projectsSortingCreatedDesc'),
  
  primaryProject: computed('projects.{[],@each.primary}', function(){
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

  /* stats */
  //total word count
  totalWordCount: computed('projectChallenges.@each.count', function(){
    let sum = 0;
    this.get('projectChallenges').forEach( (pc)=>{
      if(pc.unitType===0) {//counting words
        sum+=pc.count;
      }
    });
    return sum;
  }),
  
  //get an array of nano years done
  yearsDone: computed('projects.@each.projectChallenges', function(){
    let ids = [];
    let years = [];
    this.get('projects').forEach((p)=>{
      p.challenges.forEach((c)=>{
        if(c.eventType===0 && !ids.includes(c.id)) { // counting words
          ids.push(c.id);
          //years.push(c.startsAt.getYear());
          years.push(c.startsAt.substring(0,4));
        }
      });
    });
    return years;
  }),
  
  //how many times has the user won nano?
  nanoWinCount: computed('yearsWon', function(){
    let yw = this.get('yearsWon');
    return yw.size;
  }),
  
  //get an array of nano years won
   yearsWon: computed('projectChallenges.@each.metGoal', function(){
    //let ids = [];
    let years = new Set();
    //loop the user's projects
    this.get('projectChallenges').forEach((pc)=>{
      //is the projectChallenge a nanowrimo?
      if (pc.eventType===0) { // counting words
        //ids.push(pc.id);
        
        //did the project challenge win?
        if (pc.metGoal) {
          //years.push(pc.startsAt.getFullYear());
          years.add(pc.startsAt.substring(0,4));
        }
      }
    });
    return years;
  }),
  
  //most nanowrimo years in a row
  longestNanoStreak: computed('projects.@each.projectChallenges', function(){
    let ids = []; //track the ids of the challenges
    let years = []; //track the years participated
    this.get('projects').forEach((p)=>{
      p.challenges.forEach((c)=>{
        if(c.eventType===0 && !ids.includes(c.id)) { // nano event
          ids.push(c.id);
          //years.push( c.startsAt.getYear() );
          years.push( c.startsAt.substring(0,4) );
        }
      });
    });
    // sort the years array
    years.sort;
    let longest = 0;
    let count = 0;
    for(var i=0; i<years.length; i++) {
      let y1 = years[i];
      if (y1==years[0]) {
        count = 1;
      } else if (years[i]-1 == years[i-1]) {
        count+=1;
      } else {
        count = 1;
      }
      if (count > longest) {
        longest = count;
      }
    }
    
    return longest;
  }),
  
  highestWordCountProject: computed('projects.[]', function(){
    let highest;
    let highestCount=0;
    this.get('projects').forEach( (p)=>{
      
      //if (p.totalWordCount > highestCount ){
      if (p.unitCount > highestCount ){
        highest = p;
        highestCount = p.totalWordcount;
      }

    });
    return highest;
  }),
  
  highestWordCountProjectCount: computed('highestWordCountProject', function(){
    let c = this.get("highestWordCountProject.totalCount");
    if (!c>0) {
      return 0;
    } else {
      return c;
    }
  }),
  
  writingPace: computed('projectChallenge.@each.count', function(){
    let minutes = 0;
    let count = 0;
    //loop the project challenges
    this.get('projectChallenges').forEach((pc)=>{
      //is this a word based challenge?
      if(pc.unitType===0) {
        //loop the projectChallenge's projectSessions 
        pc.projectSessions.forEach( (ps)=>{
          //is there a start and end?
          if(ps.start && ps.end) {
            let start = moment(ps.start);
            let end = moment(ps.end);
            //get the difference in minutes
            minutes += end.diff(start,'minutes');
            count+= ps.count;
          }
        });
      }
    }); 
    if (minutes>0 && count) {
      return parseInt(count/minutes);
    } else {
      return 0;
    }
  }),
  
  save() {
    return this._super().then(() => {
      this.get('externalLinks').forEach(link => link.persistChanges());
      this.get('favoriteAuthors').forEach(author => author.persistChanges());
      this.get('favoriteBooks').forEach(book => book.persistChanges());
    });
  },
  
  firstEnabledStat: computed('statsWordCountEnabled','statsProjectsEnabled','statsYearsEnabled','statsWordiestEnabled','statsStreakEnabled', function(){
    let props = [
      "statsWordCountEnabled",
      "statsProjectsEnabled",
      "statsYearsEnabled",
      "statsWordiestEnabled",
      "statsWritingPaceEnabled",
      "statsStreakEnabled"
    ];
    
    //loop through the stats
    for( var i = 0; i< props.length; i++) {
      let prop = props[i];
      //is this prop selected by the user?
      if (this.get(`${prop}`) ) {
        return prop;
      }
    }
    return null;
  }),
  
  refreshStats: function() {
    let { auth_token } = this.get('session.data.authenticated');
    //fetch the stats from the API
    let endpoint = `${ENV.APP.API_HOST}/users/${this.get('id')}/stats`;
    fetch(endpoint, {
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then(resp=>{
      resp.json().then(json=>{
        this.set('stats', json);
      });
    });
  },
  
  refreshAnnualStats: function(year) {
    let { auth_token } = this.get('session.data.authenticated');
    //fetch the stats from the API
    let endpoint = `${ENV.APP.API_HOST}/users/annual_stats/`+year;
    fetch(endpoint, {
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
    }).then(resp=>{
      resp.json().then(json=>{
        this.set('annualStats', json);
      });
    });
  },
  
  // determine if a user has won an event based on event name
  wonEventByName: function(eventName) {
    /* find the event */
    // get the store
    let store = this.get('store');
    // get all challenges
    let challenges = store.peekAll('challenge');
    // filter by eventName
    challenges = challenges.filterBy('name', eventName);
    // filter by userId of 0 
    challenges = challenges.filterBy('userId', 0);
    // the targetChallenge  will be the first in the array (it should also be the only one in the array)
    let targetChallenge = challenges.firstObject;
    
    if (targetChallenge) {
      /* does the user have a projectChallenge for the targetChallenge */
      // get all project-challenges
      let pcs = store.peekAll('project-challenge');
      //filter for this user's project-challenges
      pcs = pcs.filterBy("user_id", parseInt(this.id));
      //filter for project challenges associated with the target challenge
      let targetPCs = pcs.filterBy("challenge_id", parseInt(targetChallenge.id));
      
      // are there target project challenges? (there should only be 1)
      if (targetPCs) {
        // loop through the project challenges
        for (var i =0; i<targetPCs.length; i++) {
          //get the pcs
          var pc = targetPCs[i];
          if (pc.currentCount>=pc.goal) {
            return true;
          }
        }
        // no win was found
        return false
      } else {
        return false;
      }
      
    } else {
      return false;
    }
  }
  
});

User.reopenClass({
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */

  optionsForPrivacyAccount:
  [
    {value:'1', name:'public', description:"Anyone with an account will be able to search for and view my profile"},
    {value:'0', name:'private', description:"Only my buddies can view my profile"},
  ],

  optionsForPrivacyProjects:
  [
    {value:'2', name:'Anyone with an account'},
    {value:'1', name:'Only my buddies and writing groups'},
    {value:'0', name:'Only me'},
  ],
  optionsForPrivacyBuddies:
  [
    {value:'2', name:'Anyone with an account'},
    {value:'1', name:'Only my buddies'},
    {value:'0', name:'Only me'},
  ]
  
});

export default User;
