import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['nw-card','year-in-review-stat'],
  statType: null,
  
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
  
  imgSrc: computed('statType', function() {
    const st = this.get('statType');
    if (st==='total words') {
      return 'NaNo-OldSchool@2x.png';
    }
    if (st==='best project') {
      return 'NaNo-CreatedNovel@2x.png';
    }
    if (st==='one day') {
      return 'NaNo-OldSchool@2x.png';
    }
    if (st==='longest streak') {
      return 'NaNo-Streak-Fire@2x.png';
    }
    if (st==='home region') {
      return 'NaNo-Region@2x.png';
    }
    return '';
  }),
  
  actions: {
  }
  
});
