import Component from '@ember/component';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';

const MAX_STATS = 3;

export default Component.extend({
  tagName: '',

  user: null,

  projects: alias('user.statsProjects'),
  showProjects: alias('user.statsProjectsEnabled'),
  showWordCount: alias('user.statsWordCountEnabled'),
  streak: alias('user.statsStreak'),
  wordiest: alias('user.statsWordiest'),
  writingPace: alias('user.statsWritingPace'),

  showWordiest: computed('user.statsWordiestEnabled', 'showWordCount', 'showProjects', 'showYears', function() {
    if (!this.get('user.statsWordiestEnabled')) { return false; }

    return [
      'showWordCount',
      'showProjects',
      'showYears'
    ].filter(prop => this.get(prop)).length < MAX_STATS;
  }),

  showWritingPace: computed('user.statsWritingPaceEnabled', 'showWordCount', 'showProjects', 'showYears', 'showWordiest', function() {
    if (!this.get('user.statsWritingPaceEnabled')) { return false; }

    return [
      'showWordCount',
      'showProjects',
      'showYears',
      'showWordiest'
    ].filter(prop => this.get(prop)).length < MAX_STATS;
  }),

  showStreak: computed('user.statsStreakEnabled', 'showWordCount', 'showProjects', 'showYears', 'showWordiest', 'showWritingPace', function() {
    if (!this.get('user.statsStreakEnabled')) { return false; }

    return [
      'showWordCount',
      'showProjects',
      'showYears',
      'showWordiest',
      'showWritingPace'
    ].filter(prop => this.get(prop)).length < MAX_STATS;
  }),

  yearsDone: computed('user.statsYearsDone', function() {
    let yearsDone = this.get('user.statsYearsDone');
    return yearsDone ? yearsDone.split(' ').sort() : [];
  }),

  yearsDoneCount: computed('yearsDone.[]', function() {
    return this.get('yearsDone').length;
  }),

  yearsWon: computed('user.statsYearsWon', function() {
    let yearsWon = this.get('user.statsYearsWon');
    return yearsWon ? yearsWon.split(' ').sort() : [];
  })
});
