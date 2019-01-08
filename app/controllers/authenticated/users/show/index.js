import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, filterBy, not }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),

  queryParams: ['editBio', 'editBioTab'],

  editBio: null,
  editBioTab: null,

  user: alias('model'),

  bioExpanded: false,
  
  numberOfFavorites: computed('favoriteAuthors', 'favoriteBooks', function(){
    let a = this.get('favoriteAuthors');
    let b = this.get('favoriteBooks');
    //get the total number of this user's favorites
    let num = a.length + b.length;
    //set a minimum
    if (num < 4) { num=3 }
    //add some extra
    num += num*0.3;
    return num;
  }),
  
  favoriteAuthors: filterBy('user.favoriteAuthors', 'isNew', false),
  favoriteBooks: filterBy('user.favoriteBooks', 'isNew', false),
  showBioReadMore: not('bioExpanded'),

  canEditUser: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),

  actions: {
    afterModalClose() {
      this.set('editBio', null);
      this.set('editBioTab', null);
    },

    showEditBio() {
      if (this.get('canEditUser')) {
        this.set('editBio', true);
      }
    }
  }
});
