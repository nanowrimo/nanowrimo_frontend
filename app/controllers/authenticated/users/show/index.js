import Controller, {inject as controller} from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, filterBy, not }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  userShow: controller("authenticated.users.show"),
  user: alias('model'),
  bioExpanded: false,
  
  hasBio: computed('user.bio', function(){
    let b = this.get('user.bio')
    return b && b.length>0;
  }),
  
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
    showEditBio() {
      if (this.get('canEditUser')) {
        this.get('userShow').send("openEditModal",'biography');
      }
    },
    showEditFavorites() {
      if (this.get('canEditUser')) {
        this.get('userShow').send("openEditModal",'favorites');
      }
    }
    
  }
});
