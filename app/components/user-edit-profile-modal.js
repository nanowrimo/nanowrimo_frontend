import Component from '@ember/component';
import { computed }  from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import UserValidations from '../validations/user';
import { filterBy, lt } from '@ember/object/computed';
import { next }  from '@ember/runloop';
import { inject as service } from '@ember/service';

const MAX_AUTHORS = 5;
const MAX_BOOKS = 5;

const DEFAULT_TAB = 'overview';

export default Component.extend({
  tagName: '',

  store: service(),

  tab: null,
  open: null,
  user: null,
  statsObject: null,
  stat1: null,
  stat2: null,
  stat3: null,
  changeset: null,
  
  //* init *//
  init(){
    this._super(...arguments);
    //define an object to store stats properties 
    let stats = [
      {"label":"Lifetime word count", 'property':"statsWordCountEnabled"},
      {"label":"Total projects", 'property':"statsProjectsEnabled"},
      {"label":"Years done and won", 'property':"statsYearsEnabled"},
      {"label":"Wordiest project", 'property':"statsWordiestEnabled"},
      {"label":"Average writing pace", 'property':"statsWritingPaceEnabled"},
      {"label":"Longest NaNo streak", 'property':"statsStreakEnabled"},
    ];
    this.set('statsObject', stats);
    
    //loop through the stats
    let statIndex = 0;
    for( var i = 0; i< stats.length; i++) {
      let prop = stats[i].property;
      //is this stat selected by the user?
      if (this.get(`user.${prop}`) ) {
        statIndex +=1;
        // have more than 3 stats been found?
        if (statIndex > 3) {
          break;
        }
        this.set(`stat${statIndex}`, prop);
      }
    }
    // create the changeset 
    let cs = new Changeset(this.get('user'), lookupValidator(UserValidations), UserValidations);
    this.set('changeset', cs);
  },
  
  /* computed properties */
  canAddAnotherAuthor: lt('favoriteAuthors.length', MAX_AUTHORS),
  canAddAnotherBook: lt('favoriteBooks.length', MAX_BOOKS),
  favoriteAuthors: filterBy('user.favoriteAuthors', 'isDeleted', false),
  favoriteBooks: filterBy('user.favoriteBooks', 'isDeleted', false),

  statsWordCountSelected: computed('stats1','stats2', 'stats3', function(){
    let key = "statsWordCountEnabled";
    let s1 = this.get('stats1')===key;
    let s2 = this.get('stats2')===key;
    let s3 = this.get('stats3')===key;
    return s1 || s2 || s3;
  }),

  statsProjectsSelected: computed('stats1','stats2', 'stats3', function(){
    let key = "statsProjectsEnabled"
    let s1 = this.get('stats1')===key;
    let s2 = this.get('stats2')===key;
    let s3 = this.get('stats3')===key;
    return s1 || s2 || s3;
  }),
  
  statsYearsSelected: computed('stats1','stats2', 'stats3', function(){
    let key = "statsYearsEnabled"
    let s1 = this.get('stats1')===key;
    let s2 = this.get('stats2')===key;
    let s3 = this.get('stats3')===key;
    return s1 || s2 || s3;
  }),
  
  statsWordiestSelected: computed('stats1','stats2', 'stats3', function(){
    let key = "statsWordiestEnabled"
    let s1 = this.get('stats1')===key;
    let s2 = this.get('stats2')===key;
    let s3 = this.get('stats3')===key;
    return s1 || s2 || s3;
  }),
  
  statsWritingPaceSelected: computed('stats1','stats2', 'stats3', function(){
    let key = "statsWritingPaceEnabled"
    let s1 = this.get('stats1')===key;
    let s2 = this.get('stats2')===key;
    let s3 = this.get('stats3')===key;
    return s1 || s2 || s3;
  }),
  
  statsStreakSelected: computed('stats1','stats2', 'stats3', function(){
    let key = "statsStreakEnabled"
    let s1 = this.get('stats1')===key;
    let s2 = this.get('stats2')===key;
    let s3 = this.get('stats3')===key;
    return s1 || s2 || s3;
  }),

  activeTab: computed('tab', {
    get() {
      return this.get('tab') || DEFAULT_TAB;
    },
    set(key, value) {
      if (value === DEFAULT_TAB) {
        this.set('tab', null);
      } else {
        this.set('tab', value);
      }
      return value;
    }
  }),

  
  /* actions */
  actions: {
    onHidden() {
      this.get('user').rollbackExternalLinks();
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    },
    statsSelect1Changed(val) {
      this.set('stat1', val);
    },
    statsSelect2Changed(val) {
      this.set('stat2', val);
    },
    statsSelect3Changed(val) {
      this.set('stat3', val);
    },
    
    updateChangeset() {
      let cs = this.get('changeset');
      //set all stats settings to false
      cs.set('statsWordCountEnabled', false);
      cs.set('statsProjectsEnabled', false);
      cs.set('statsYearsEnabled', false);
      cs.set('statsWordiestEnabled', false);
      cs.set('statsWritingPaceEnabled', false);
      cs.set('statsStreakEnabled', false);
      //set the user selected stats settings to true
      let s1 = this.get('stat1');
      if (s1) {
        cs.set(s1, true);
      }
      let s2 = this.get('stat2');
      if (s2) {
        cs.set(s2, true);
      }
      let s3 = this.get('stat3');
      if (s3) {
        cs.set(s3, true);
      }
    },
    
    addAuthor() {
      if (this.get('canAddAnotherAuthor')) {
        this._addAuthor();
      }
    },

    addBook() {
      if (this.get('canAddAnotherBook')) {
        this._addBook();
      }
    },

    deleteAuthor(author) {
      author.deleteRecord();
    },

    deleteBook(book) {
      book.deleteRecord();
    },
    
    onHidden() {
      this.get('user').rollbackFavorites();
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
    
  },
  /* component methods */
  _addAuthor() {
    let author = this.get('store').createRecord('favorite-author');
    next(() => {
      author.set('user', this.get('user'));
    })
    return author;
  },

  _addBook() {
    let book = this.get('store').createRecord('favorite-book');
    next(() => {
      book.set('user', this.get('user'));
    })
    return book;
  },

});


