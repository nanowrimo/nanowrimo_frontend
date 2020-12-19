import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['nw-card','year-in-review-stat'],
  statType: null,
  
  totalWords: computed('annualStats.total_words', function() {
    const tw = this.get('annualStats.total_words');
    if (tw===1) {
      return tw.toLocaleString() + " word";
    } else {
      return tw.toLocaleString() + " words";
    }
  }),
  
  totalWordsLastYear: computed('annualStats.total_words_last_year', function() {
    const tw = this.get('annualStats.total_words_last_year');
    if (tw>0) {
      if (tw>1) {
        return "Last year you wrote " + tw.toLocaleString() + " words.";
      } else {
        return "Last year you wrote " + tw.toLocaleString() + " word.";
      }
    } else {
      return '';
    }
  }),
  
  dayMaxCount: computed('annualStats.day_max_count', function() {
    const tw = this.get('annualStats.day_max_count');
    if (tw===1) {
      return tw.toLocaleString() + " word";
    } else {
      return tw.toLocaleString() + " words";
    }
  }),
  
  dayMaxDate: computed('annualStats{day_max_date,day_max_count}', function() {
    const dmd = this.get('annualStats.day_max_date');
    const dmc = this.get('annualStats.day_max_count');
    if (dmc>0) {
      return "Written on " + dmd + ".";
    } else {
      return "";
    }
  }),
  
  streakDays: computed('annualStats.streak_days', function() {
    const sd = this.get('annualStats.streak_days');
    if (sd===1) {
      return sd.toLocaleString() + " day!";
    } else {
      return sd.toLocaleString() + " days in a row!";
    }
  }),
  
  streakDates: computed('annualStats.{streak_days,streak_start,streak_end}', function() {
    const sd = this.get('annualStats.streak_days');
    const ss = this.get('annualStats.streak_start');
    const se = this.get('annualStats.streak_end');
    if (ss && se) {
      if (sd>1) {
        return "Your streak lasted from " + ss + " to " + se + "."
      } else {
        return "Your one-day streak happened on " + ss + "."
      }
    } else {
      return "";
    }
  }),
  
  projectMaxCount: computed('annualStats.project_count', function() {
    const tw = this.get('annualStats.project_count');
    if (tw>0) {
      if (tw===1) {
        return "You added " + tw.toLocaleString() + " word to this writing project.";
      } else {
        return "You added " + tw.toLocaleString() + " words to this writing project.";
      }
    } else {
      return "";
    }
  }),
  
  projectTitle: computed('annualStats.project_count', function() {
    const pc = this.get('annualStats.project_count');
    const pt = this.get('annualStats.project_title');
    if (pc>0) {
      return pt;
    } else {
      return "You didn't work on a project in " + this.get('year');
    }
  }),
  
  superString: computed('statType', function() {
    const st = this.get('statType');
    if (st==='total words') {
      return 'Total Words Written this Year';
    }
    if (st==='best project') {
      return 'Writing Project You Worked on the Most';
    }
    if (st==='longest streak') {
      return 'Your Longest Writing Streak this Year';
    }
    if (st==='one day') {
      return 'Most Words Written in One Day';
    }
    if (st==='home region') {
      return 'Your Home Region Word-Count Total';
    }
    return '';
  }),
  
  mainString: computed('annualStats', function() {
    const st = this.get('statType');
    if (st==='total words') {
      return this.get('totalWords');
    }
    if (st==='best project') {
      return this.get('projectTitle');
    }
    if (st==='longest streak') {
      return this.get('streakDays');
    }
    if (st==='one day') {
      return this.get('dayMaxCount');
    }
    if (st==='home region') {
      return 'Your Home Region Word-Count Total';
    }
    return '';
  }),
  
  subString: computed('annualStats', function() {
    const st = this.get('statType');
    if (st==='total words') {
      return this.get('totalWordsLastYear');
    }
    if (st==='best project') {
      return this.get('projectMaxCount');
    }
    if (st==='longest streak') {
      return this.get('streakDates');
    }
    if (st==='one day') {
      return this.get('dayMaxDate');
    }
    if (st==='home region') {
      return 'Your Home Region Word-Count Total';
    }
    return '';
  }),
  
  imgSrc: computed('statType', function() {
    const st = this.get('statType');
    if (st==='total words') {
      return 'NaNo-OldSchool.png';
    }
    if (st==='best project') {
      return 'NaNo-CreatedNovel.png';
    }
    if (st==='one day') {
      return 'NaNo-OldSchool.png';
    }
    if (st==='longest streak') {
      return 'NaNo-Streak-Fire.png';
    }
    if (st==='home region') {
      return 'NaNo-Region.png';
    }
    return '';
  }),
  
});
