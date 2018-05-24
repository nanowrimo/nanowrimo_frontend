import Component from '@ember/component';
import { computed }  from '@ember/object';
import { filterBy, lt } from '@ember/object/computed';
import { next }  from '@ember/runloop';
import { inject as service } from '@ember/service';

const DEFAULT_TAB = 'biography';
const MAX_AUTHORS = 5;
const MAX_BOOKS = 5;

export default Component.extend({
  store: service(),

  tagName: '',

  tab: null,
  open: null,
  user: null,

  canAddAnotherAuthor: lt('favoriteAuthors.length', MAX_AUTHORS),
  canAddAnotherBook: lt('favoriteBooks.length', MAX_BOOKS),
  favoriteAuthors: filterBy('user.favoriteAuthors', 'isDeleted', false),
  favoriteBooks: filterBy('user.favoriteBooks', 'isDeleted', false),

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

  init() {
    this._super(...arguments);

    if (this.get('canAddAnotherAuthor')) {
      this._addAuthor();
    }
    if (this.get('canAddAnotherBook')) {
      this._addBook();
    }
  },

  actions: {
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
  }
});
